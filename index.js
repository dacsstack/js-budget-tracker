const form = document.querySelector(".add");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const notify = document.querySelector(".notify");

//Save to the local Storage
let transactions =
  localStorage.getItem("transactions") !== null
    ? JSON.parse(localStorage.getItem("transactions"))
    : [];
//End Of Save to the local Storage

//Update Statistics
function updateStatistics() {
  const updatedIncome = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => (total += transaction.amount), 0);

  const updatedExpense = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => (total += Math.abs(transaction.amount)), 0);

  updatedBalance = updatedIncome - updatedExpense;
  balance.textContent = updatedBalance;
  income.textContent = updatedIncome;
  expense.textContent = updatedExpense;
}
//End OfUpdate Statistics

//Function Generate LI
function generateTemplate(id, source, amount, time) {
  return `<li data-id="${id}">
                <p>
                    <span>${source}</span>
                    <span id="time">${time}</span>
                </p>
                $<span>${parseFloat(amount.replace(",", ""))}</span>
                <i class="bi bi-trash delete"></i>
            </li>`;
}
//End Function Generate LI

//Transaction DOM
function addTransactionDOM(id, source, amount, time) {
  if (amount > 0) {
    incomeList.innerHTML += generateTemplate(id, source, amount, time); //Include Generate template
  } else {
    expenseList.innerHTML += generateTemplate(id, source, amount, time); //Include Generate template
  }
}
//End Of Transaction DOM

//Function Transaction
function addTransaction(source, amount) {
  const time = new Date();
  const transaction = {
    id: Math.floor(Math.random() * 100000),
    source: source,
    amount: amount,
    time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`,
  };
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  addTransactionDOM(transaction.id, source, amount, transaction.time); //Include transaction DOM
}
//End Of Function Transaction

//Submit
form.addEventListener("submit", (event) => {
  event.preventDefault();

  //if condition for empty transaction
  if (form.source.value.trim() === "" || form.amount.value === "") {
    notify.classList.remove("hide");
    return (notify.querySelector(
      "p"
    ).textContent = `Please add a proper transaction!`);
  } else {
    notify.classList.add("hide");
  }

  //end of if condition for empty transaction
  addTransaction(form.source.value.trim(), Number(form.amount.value));
  updateStatistics();
  form.reset();
});
//End of Submit

//Get Transaction or Fetch Data
function getTransaction() {
  transactions.forEach((transaction) => {
    if (transaction.amount > 0) {
      incomeList.innerHTML += generateTemplate(
        transaction.id,
        transaction.source,
        transaction.amount,
        transaction.time
      );
    } else {
      expenseList.innerHTML += generateTemplate(
        transaction.id,
        transaction.source,
        transaction.amount,
        transaction.time
      );
    }
  });
}
//End of Get Transaction or Fetch Data

//Delete Transaction
function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => {
    return transaction.id !== id;
  });
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

incomeList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(Number(event.target.parentElement.dataset.id));
    updateStatistics();
  }
});

expenseList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(Number(event.target.parentElement.dataset.id));
    updateStatistics();
  }
});
//End Of Delete Transaction

//Every time we load call the function
function init() {
  updateStatistics();
  getTransaction();
}

init();
//End Of Every time we load call the function
