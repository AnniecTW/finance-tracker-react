// Thin wrapper around the Azure OpenAI API

const endpoint = process.env.AZURE_OPENAI_ENDPOINT!.replace(/\/$/, "");
const key = process.env.AZURE_OPENAI_KEY!;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT!;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION!;

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: unknown; // string or an array of content parts (text + image)
};

export async function chatCompletionJson(
  messages: ChatMessage[],
): Promise<string> {
  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": key,
    },
    body: JSON.stringify({
      messages,
      response_format: { type: "json_object" },
      reasoning_effort: "low", // Cuts tokens/latency
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Azure OpenAI ${res.status}: ${errText}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0].message.content;
}
