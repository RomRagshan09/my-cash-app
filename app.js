const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbw7qUMGP-58yoXySzM1e9CiaiNFiIPnBIfukuTee4rv8mN4LLWqZjmg4hNXblUGpfv1/exec";

let transactionType = "income";

document.getElementById("date").value =
    new Date().toISOString().split("T")[0];


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


async function saveTransaction() {

    const date =
        document.getElementById("date").value;

    const description =
        document.getElementById("description").value.trim();

    const category =
        document.getElementById("category").value;

    const amount =
        document.getElementById("amount").value;

    const message =
        document.getElementById("message");


    if (!date || !description || !amount) {

        message.textContent =
            "Please fill in all required fields.";

        return;
    }


    const transaction = {

        date: date,

        description: description,

        category: category,

        type: transactionType,

        amount: Number(amount)

    };


    try {

        message.textContent =
            "Saving transaction...";


        await fetch(SCRIPT_URL, {

            method: "POST",

            mode: "no-cors",

            headers: {
                "Content-Type": "text/plain"
            },

            body: JSON.stringify(transaction)

        });


        message.textContent =
            "Transaction saved successfully!";


        document.getElementById("description").value = "";

        document.getElementById("amount").value = "";


    } catch (error) {

        console.error(error);

        message.textContent =
            "Something went wrong. Please try again.";

    }
}
