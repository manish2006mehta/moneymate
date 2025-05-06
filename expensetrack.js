// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");

    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    // Function to add a new expense
    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;

        if (!name || isNaN(amount) || !category) {
            alert("Please fill in all fields");
            return;
        }

        const expense = { id: Date.now(), name, amount, category, date };

        expenses.push(expense);
        localStorage.setItem("expenses", JSON.stringify(expenses));

        displayExpenses(expenses);
        updateTotalAmount();
        expenseForm.reset();
    });

    // Function to display expenses
    function displayExpenses(expenses) {
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${expense.name}</td>
                <td>₹${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>`;
            expenseList.appendChild(row);
        });
    }

    // Function to update total amount
    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = `₹${total.toFixed(2)}`;
    }

    // Event delegation for edit and delete buttons
    expenseList.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        if (e.target.classList.contains("delete-btn")) {
            expenses = expenses.filter(expense => expense.id !== id);
            localStorage.setItem("expenses", JSON.stringify(expenses));
            displayExpenses(expenses);
            updateTotalAmount();
        } else if (e.target.classList.contains("edit-btn")) {
            const expense = expenses.find(expense => expense.id === id);
            document.getElementById("expense-name").value = expense.name;
            document.getElementById("expense-amount").value = expense.amount;
            document.getElementById("expense-category").value = expense.category;
            document.getElementById("expense-date").value = expense.date;
            expenses = expenses.filter(expense => expense.id !== id);
            localStorage.setItem("expenses", JSON.stringify(expenses));
            displayExpenses(expenses);
            updateTotalAmount();
        }
    });

    // Filter expenses by category
    filterCategory.addEventListener("change", (e) => {
        const category = e.target.value;
        const filteredExpenses = category === "All" ? expenses : expenses.filter(expense => expense.category === category);
        displayExpenses(filteredExpenses);
    });

    // Initial display of expenses
    displayExpenses(expenses);
    updateTotalAmount();
});
