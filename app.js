const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbw7qUMGP-58yoXySzM1e9CiaiNFiIPnBIfukuTee4rv8mN4LLWqZjmg4hNXblUGpfv1/exec";


let transactionType = "income";

let allTransactions = [];


// ===============================
// START APP
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        document.getElementById("date").value =
            new Date()
                .toISOString()
                .split("T")[0];

        loadDashboard();

    }
);



// ===============================
// SET INCOME / EXPENSE
// ===============================

function setType(type) {

    transactionType = type;


    const incomeBtn =
        document.getElementById("incomeBtn");

    const expenseBtn =
        document.getElementById("expenseBtn");


    if (type === "income") {

        incomeBtn.classList.add("active");

        expenseBtn.classList.remove("active");

    } else {

        expenseBtn.classList.add("active");

        incomeBtn.classList.remove("active");

    }
}



// ===============================
// LOAD DATA FROM GOOGLE SHEETS
// ===============================

async function loadDashboard() {

    try {

        const response =
            await fetch(SCRIPT_URL);


        const result =
            await response.json();


        if (!result.success) {

            console.error(result.message);

            return;
        }


        allTransactions =
            result.transactions || [];


        calculateTotals();


        displayTransactions();


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }
}



// ===============================
// CALCULATE TOTALS
// ===============================

function calculateTotals() {

    let income = 0;

    let expenses = 0;


    allTransactions.forEach(
        transaction => {

            const amount =
                Number(transaction.amount);


            if (
                transaction.type
                    .toLowerCase()
                    === "income"
            ) {

                income += amount;

            }


            if (
                transaction.type
                    .toLowerCase()
                    === "expense"
            ) {

                expenses += amount;

            }

        }
    );


    const balance =
        income - expenses;


    document.getElementById("income")
        .textContent =
        formatCurrency(income);


    document.getElementById("expense")
        .textContent =
        formatCurrency(expenses);


    document.getElementById("balance")
        .textContent =
        formatCurrency(balance);

}



// ===============================
// DISPLAY TRANSACTIONS
// ===============================

function displayTransactions() {

    const container =
        document.getElementById(
            "transactionList"
        );


    const count =
        document.getElementById(
            "transactionCount"
        );


    count.textContent =
        allTransactions.length
        + (
            allTransactions.length === 1
                ? " transaction"
                : " transactions"
        );


    if (
        allTransactions.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-state">
                No transactions yet.
            </div>
        `;

        return;
    }


    // Newest first

    const transactions =
        [...allTransactions]
            .reverse();


    container.innerHTML =
        transactions.map(
            transaction => {


                const isIncome =
                    transaction.type
                        .toLowerCase()
                        === "income";


                const sign =
                    isIncome
                        ? "+"
                        : "-";


                const amountClass =
                    isIncome
                        ? "income-amount"
                        : "expense-amount";


                return `

                    <div class="transaction">

                        <div class="transaction-info">

                            <div class="transaction-description">

                                ${escapeHtml(
                                    transaction.description
                                )}

                            </div>


                            <div class="transaction-meta">

                                ${transaction.date}
                                •
                                ${escapeHtml(
                                    transaction.category
                                )}

                            </div>

                        </div>


                        <div class="transaction-right">

                            <div class="transaction-amount ${amountClass}">

                                ${sign}
                                ${formatCurrency(
                                    transaction.amount
                                )}

                            </div>


                            <button
                                class="delete-button"
                                onclick="deleteTransaction(
                                    ${transaction.row}
                                )">

                                🗑

                            </button>

                        </div>

                    </div>

                `;

            }
        ).join("");

}



// ===============================
// SAVE TRANSACTION
// ===============================

async function saveTransaction() {

    const date =
        document.getElementById("date").value;


    const description =
        document.getElementById(
            "description"
        ).value.trim();


    const category =
        document.getElementById(
            "category"
        ).value;


    const amount =
        document.getElementById(
            "amount"
        ).value;


    const message =
        document.getElementById(
            "message"
        );


    if (
        !date ||
        !description ||
        !amount
    ) {

        message.textContent =
            "Please fill in all required fields.";

        return;
    }


    if (Number(amount) <= 0) {

        message.textContent =
            "Amount must be greater than 0.";

        return;
    }


    const transaction = {

        action: "add",

        date: date,

        description: description,

        category: category,

        type: transactionType,

        amount: Number(amount)

    };


    try {

        message.textContent =
            "Saving transaction...";


        await fetch(
            SCRIPT_URL,
            {

                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type":
                        "text/plain"
                },

                body:
                    JSON.stringify(
                        transaction
                    )

            }
        );


        message.textContent =
            "Transaction saved successfully!";


        document.getElementById(
            "description"
        ).value = "";


        document.getElementById(
            "amount"
        ).value = "";


        // Refresh dashboard

        setTimeout(
            loadDashboard,
            1000
        );


    } catch (error) {

        console.error(error);

        message.textContent =
            "Something went wrong.";

    }

}



// ===============================
// DELETE TRANSACTION
// ===============================

async function deleteTransaction(row) {

    const confirmed =
        confirm(
            "Delete this transaction?"
        );


    if (!confirmed) {

        return;
    }


    try {

        await fetch(
            SCRIPT_URL,
            {

                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type":
                        "text/plain"
                },

                body:
                    JSON.stringify({

                        action: "delete",

                        row: row

                    })

            }
        );


        setTimeout(
            loadDashboard,
            1000
        );


    } catch (error) {

        console.error(error);

        alert(
            "Could not delete transaction."
        );

    }

}



// ===============================
// FORMAT CURRENCY
// ===============================

function formatCurrency(amount) {

    return (
        "LKR "
        +
        Number(amount).toLocaleString(
            "en-LK",
            {
                minimumFractionDigits: 2,

                maximumFractionDigits: 2
            }
        )
    );

}



// ===============================
// SECURITY
// ===============================

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}
