import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { chatCompletionJson } from "../lib/openai.js";
import { getUserId } from "../lib/auth.js";
import { receiptSchema, type Receipt } from "../schemas/receipt.js";

const SYSTEM_PROMPT = `You are a receipt parsing assistant for a personal finance app.
Extract structured data from the receipt image. Respond with ONLY a JSON object.
Schema:
{
  "merchant": string | null,          // store / vendor name
  "total_amount": number | null,      // final total paid, number only (no currency symbol)
  "currency": string | null,          // ISO code if visible, else best guess e.g. "USD", "TWD"
  "date": string | null,              // transaction date as YYYY-MM-DD, or null if not visible
  "suggested_category": string        // one of: Food, Transport, Housing, Entertainment, Health, Other
}
Use null for any unreadable field.`;

// "malformed_json": the model returned non-JSON (a model/prompt problem)
// "empty": valid JSON, but nothing meaningful was read (an image problem)
type ExtractOutcome =
  | { ok: true; receipt: Receipt }
  | { ok: false; reason: "malformed_json" | "empty" };

async function extractReceipt(image: string): Promise<ExtractOutcome> {
  const content = await chatCompletionJson([
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: [
        { type: "text", text: "Extract the receipt fields as JSON." },
        { type: "image_url", image_url: { url: image } },
      ],
    },
  ]);

  let raw: unknown;
  try {
    raw = JSON.parse(content);
  } catch {
    return { ok: false, reason: "malformed_json" };
  }

  const parsed = receiptSchema.parse(raw);

  if (parsed.merchant === null && parsed.total_amount === null) {
    return { ok: false, reason: "empty" };
  }
  return { ok: true, receipt: parsed };
}

app.http("receipt-parse", {
  methods: ["POST"],
  authLevel: "anonymous", // Azure key off; gate with a Supabase JWT in-handler
  route: "receipt/parse",
  handler: async (
    request: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    try {
      const userId = await getUserId(request);
      if (!userId) {
        return { status: 401, jsonBody: { error: "Unauthorized" } };
      }

      const body = (await request.json()) as { image?: string };
      if (!body.image) {
        return {
          status: 400,
          jsonBody: { error: "Missing 'image' (base64 data URL)" },
        };
      }

      // Retry once before giving up
      let outcome = await extractReceipt(body.image);
      if (!outcome.ok) {
        context.log(
          `receipt-parse: attempt 1 failed (${outcome.reason}), retrying`,
        );
        outcome = await extractReceipt(body.image);
      }

      if (outcome.ok) {
        return { jsonBody: outcome.receipt };
      }

      // Final failure
      context.log(`receipt-parse: gave up (${outcome.reason})`);
      if (outcome.reason === "empty") {
        return {
          status: 422,
          jsonBody: {
            error: "Unable to read receipt. Please upload a clearer image.",
          },
        };
      }
      return {
        status: 502,
        jsonBody: {
          error: "Couldn't read the receipt reliably. Please try again.",
        },
      };
    } catch (err) {
      // Genuine backend/API failure
      context.log("receipt-parse error:", err);
      return { status: 500, jsonBody: { error: "Failed to parse receipt" } };
    }
  },
});
