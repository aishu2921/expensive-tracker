// Get elements
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const addBtn = document.getElementById("addBtn");
const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");

//const API_URL = "http://localhost:5000/api/expenses";

const API_URL = "http://localhost:3000/expenses";
// Load expenses when page loads
window.addEventListener("DOMContentLoaded", function () {

    fetch(API_URL)
        .then(res => res.json())
        .then(expenses => {

            expenseList.innerHTML = "";
            expenses.forEach(expense => {
                createExpense(
                    expense._id,
                    expense.name,
                    expense.amount,
                    expense.category,
                    expense.paid
                );
            });

            updateTotal();
        });

});


// Update total amount
function updateTotal() {

    let total = 0;

    const amountElements = document.querySelectorAll(".expenseAmountValue");

    amountElements.forEach(el => {
        total += Number(el.textContent);
    });

    totalAmount.textContent = total.toFixed(2);
}


// Create expense item
function createExpense(id, name, amount, category, paid = false) {

    const li = document.createElement("li");

    const leftDiv = document.createElement("div");

    const title = document.createElement("strong");
    title.textContent = name;

    const details = document.createElement("p");
    details.innerHTML = `
        ₹<span class="expenseAmountValue">${amount}</span> | ${category}
    `;

    if (paid) {
        li.classList.add("paid");
    }

    leftDiv.appendChild(title);
    leftDiv.appendChild(details);


    // Paid toggle button
    const paidBtn = document.createElement("button");
    paidBtn.textContent = "✔";

    paidBtn.addEventListener("click", function () {

        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paid: !paid })
        })
        .then(() => {
            li.classList.toggle("paid");
        });

    });


    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", function () {

        fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            li.remove();
            updateTotal();
        });

    });


    li.appendChild(leftDiv);
    li.appendChild(paidBtn);
    li.appendChild(deleteBtn);

    expenseList.appendChild(li);

    updateTotal();
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
// Add expense
addBtn.addEventListener("click", function () {

    const name = expenseName.value.trim();
    const amount = expenseAmount.value.trim();
    const category = expenseCategory.value;

    if (name === "" || amount === "") {
        alert("Please fill all fields");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            amount: Number(amount),
            category: category,
            paid: false
        })
    })
    .then(res => res.json())
    .then(newExpense => {

        createExpense(
            newExpense._id,
            newExpense.name,
            newExpense.amount,
            newExpense.category,
            newExpense.paid
        );

        expenseName.value = "";
        expenseAmount.value = "";

    });

});

document.getElementById("darkToggle").addEventListener("click", function () {
    document.body.classList.toggle("dark");
});                         
// Add with Enter key
expenseName.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addBtn.click();
    }
});