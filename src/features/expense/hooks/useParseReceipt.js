import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import supabase from "../../../services/supabase";

// Turn a File into a base64 data URL
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the image file"));
    reader.readAsDataURL(file);
  });
}

async function parseReceipt(file) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("You must be logged in to scan a receipt");

  const image = await fileToDataUrl(file);

  const res = await fetch("/api/receipt/parse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ image }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || "Could not scan receipt");
  }
  return body;
}

export function useParseReceipt() {
  const { mutate, isPending } = useMutation({
    mutationFn: parseReceipt,
    onError: (err) => toast.error(err.message),
  });

  return { scanReceipt: mutate, isScanning: isPending };
}
