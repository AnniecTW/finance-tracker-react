import Button from "../../ui/Button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addExpenses } from "../../../services/expensesService";
import { useExpenses } from "../../../contexts/ExpensesContext";

function AddExpense() {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");

  const queryClient = useQueryClient();
  const { reloadAllOverviews } = useExpenses();

  const { mutate: addExpense } = useMutation({
    mutationFn: addExpenses,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      reloadAllOverviews();
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!item.trim() || isNaN(amount) || amount <= 0) return;

    const newExpense = {
      item,
      amount: Number(amount),
    };

    addExpense(newExpense);

    setItem("");
    setAmount("");
  }
  return (
    <main>
      <form onSubmit={handleSubmit} className="add-expense-form">
        <h2>Add New Expense 💲</h2>
        <label>Item</label>
        <input
          type="text"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <label>Amount</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button type="submit">Add</Button>
      </form>
    </main>
  );
}

export default AddExpense;
