import { useParams } from "react-router-dom";

function Expense() {
  const { id } = useParams();
  return <div>Expense {id}</div>;
}

export default Expense;
