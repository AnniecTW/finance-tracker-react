import supabase, { supabaseUrl } from "./supabase";

export async function getAllExpenses() {
  const { data, error } = await supabase.from("transactions").select("*");
  if (error) {
    console.error(error);
    throw new Error("Transactions could not be loaded");
  }

  return data;
}

export async function deleteExpenseById(id) {
  const { data, error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Transaction could not be deleted");
  }

  return data;
}

export async function getExpenseById(id) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error(`Transaction could not be loaded`);
  }

  return data;
}

export async function addEditExpense({ id, ...newExpense }) {
  let imageUrl = null;

  const hasImagePath = newExpense.image?.startsWith?.(
    `${supabaseUrl}/storage/v1/object/public/transaction-images`
  );
  // image deleted
  if (!newExpense.image) {
    imageUrl = null;

    // new image uploaded
  } else if (!hasImagePath) {
    const imageName = `${Math.random()}-${
      newExpense.image?.name ?? ""
    }`.replaceAll("/", "");
    const { error: uploadError } = await supabase.storage
      .from("transaction-images")
      .upload(imageName, newExpense.image);

    if (uploadError) throw new Error("Image upload failed");

    const { data: publicData } = supabase.storage
      .from("transaction-images")
      .getPublicUrl(imageName);
    imageUrl = publicData?.publicUrl ?? null;

    // image unchaged
  } else {
    imageUrl = newExpense.image ?? null;
  }

  let query = supabase.from("transactions");
  const payload = {
    item: newExpense.item,
    amount: newExpense.amount,
    userID: newExpense.userID,
    image: imageUrl,
  };

  if (!id) query = query.insert([payload]); // CREATE
  else query = query.update(payload).eq("id", id); // EDIT

  const { data, error } = await query.select();

  if (error) throw new Error("Transaction could not be created or updated");

  return data;
}
