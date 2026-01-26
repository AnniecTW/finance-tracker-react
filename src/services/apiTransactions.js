import supabase, { supabaseUrl } from "./supabase";

export async function getAllExpenses() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Transactions could not be loaded");
  }

  return data;
}

// Get the latest 50 expenses
export async function getRecentExpenses() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error(error);
    throw new Error("Could not load recent transactions");
  }

  return data;
}

// Delete expense by id
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

// Retrieve expense by id
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

//  Add new expense or update expense by id
export async function addEditExpense({ id, ...newExpense }) {
  const imageField = newExpense.image; // File, FileList, or URL

  const isNewFile =
    imageField instanceof File ||
    (imageField instanceof FileList && imageField.length > 0);

  const hasImagePath =
    typeof imageField === "string" &&
    imageField.startsWith(
      `${supabaseUrl}/storage/v1/object/public/transaction-images`,
    );

  let imageUrl = null;

  if (isNewFile) {
    // new image uploaded
    const file = imageField instanceof FileList ? imageField[0] : imageField;
    const imageName = `${Math.random()}-${file.name}`.replaceAll("/", "");

    const { error: uploadError } = await supabase.storage
      .from("transaction-images")
      .upload(imageName, file);

    if (uploadError) throw new Error("Image upload failed");

    const { data: publicData } = supabase.storage
      .from("transaction-images")
      .getPublicUrl(imageName);

    imageUrl = publicData.publicUrl;
  } else if (hasImagePath) {
    // image unchanged
    imageUrl = imageField;
  } else {
    // image deleted or no image uploaded
    imageUrl = null;
  }

  const { item, amount, category, notes, user_id } = newExpense;
  const payload = {
    item,
    amount,
    category,
    notes,
    user_id,
    image: imageUrl,
  };

  let query = supabase.from("transactions");

  if (!id)
    query = query.insert([payload]); // CREATE
  else query = query.update(payload).eq("id", id); // EDIT

  const { data, error } = await query.select();

  if (error) throw new Error("Transaction could not be saved");

  return data;
}
