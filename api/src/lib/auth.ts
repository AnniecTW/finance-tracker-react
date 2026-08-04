import { createClient } from "@supabase/supabase-js";
import type { HttpRequest } from "@azure/functions";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

export async function getUserId(request: HttpRequest): Promise<string | null> {
  // Azure SWA consumes Authorization header before it reaches
  // managed functions, so the client sends the token in a custom header
  const token =
    request.headers.get("x-supabase-token")?.trim() ||
    (request.headers.get("authorization") ?? "")
      .replace(/^Bearer\s+/i, "")
      .trim();
  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user.id;
}
