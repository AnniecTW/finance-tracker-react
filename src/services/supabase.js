import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://rwhvouvalipxqbfxeboh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3aHZvdXZhbGlweHFiZnhlYm9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NjUzMzEsImV4cCI6MjA3NDA0MTMzMX0.zyu8WYH5SPE3ZRK7O93QDt2NKEKNBNp8Uc_OTDHyP4M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
