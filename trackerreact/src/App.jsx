import { useEffect, useState } from "react";
import "./App.css";

const API = "https://expensive-tracker-backend-uuaz.onrender.com/expenses";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [darkMode, setDarkMode] = useState(false);

  // Fetch Expenses
  const fetchExpenses = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setExpenses(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add Expense
  const addExpense = async () => {
    if (!name || !amount) {
      alert("Please fill all fields");
      return;
    }

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        amount: Number(amount),
        category,
        paid: false,
      }),
    });

    setName("");
    setAmount("");
    fetchExpenses();
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    fetchExpenses();
  };

  // Toggle Paid Status
  const togglePaid = async (expense) => {
    await fetch(`${API}/${expense._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paid: !expense.paid }),
    });
    fetchExpenses();
  };

  // Calculate Total
  const total = expenses.reduce((sum, exp) => {
    return sum + Number(exp.amount);
  }, 0);

  return (
    <div className={darkMode ? "container dark" : "container"}>
      <div className="top-bar">
        <h1>💰 Expense Tracker</h1>
        <button
          className="toggle-mode"
          onClick={() => setDarkMode(!darkMode)}
        >
          🌙
        </button>
      </div>

      <div className="input-section">
        <input
          type="text"
          placeholder="Expense Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Food">🍔 Food</option>
          <option value="Travel">🚗 Travel</option>
          <option value="Shopping">🛍 Shopping</option>
          <option value="Bills">💡 Bills</option>
        </select>

        <button onClick={addExpense}>Add</button>
      </div>

      <h2>Total: ₹ {total.toFixed(2)}</h2>

      <ul className="expense-list">
        {expenses.map((expense) => (
          <li
            key={expense._id}
            className={expense.paid ? "paid" : ""}
          >
            <div>
              <strong>{expense.name}</strong>
              <p>
                ₹{expense.amount} | {expense.category}
              </p>
            </div>

            <button onClick={() => togglePaid(expense)}>✔</button>

            <button onClick={() => deleteExpense(expense._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;