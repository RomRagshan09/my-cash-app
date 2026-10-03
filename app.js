const SCRIPT_URL =
    "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnRx-q16VoMdn2I7_6bDvZ9bAI3TWsABs4bFnkLbwl39yn_TA_1hX-_QvsYeCtNeeN5tNtyNxD8zoLA_AaTzXdYVN9HExW2wRMhItkzXZyoAWhfDNgu-M3xPwnJiVIq8FZPOUiTjbCBLuwEMYl6yueQPnW5-PWmC2LM-OtjYzhvJSkWMeGAqTEU3x6trWMqPe7GH343Jo0PttCiHp19v2kuI7ppnjUtF6mUHLW-7tRYVRxHDJiKMrH9zngw4iLIpWV9so2Tab4o7t37nhTmobDLdgxeBZg&lib=MPJKpQ1BiZuTczTGWPAN9lBj_FdURCWWA";

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
