import Button from "../../ui/Button";
/* import { useNavigate } from "react-router-dom"; */
import { useState } from "react";
import { useExpenses } from "../../../contexts/ExpensesContext";

function AddExpense() {
  const { handleAddExpense: onAddExpense } = useExpenses();

  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");

  /* const navigate = useNavigate(); */
  function handleSubmit(e) {
    e.preventDefault();

    if (!item.trim() || isNaN(amount) || amount <= 0) return;

    const id = crypto.randomUUID();
    const newExpense = {
      id,
      item,
      amount: Number(amount),
    };

    onAddExpense(newExpense);

    setItem("");
    setAmount("");
    /* navigate(-1); */
  }
  return (
    <main>
      <form className="add-expense-form">
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
        <Button onClick={handleSubmit}>Add</Button>
      </form>
    </main>
  );
}

export default AddExpense;
