// Task 2: Dynamic Shopping List
// Every list item is built with document.createElement() (no innerHTML).

const addForm = document.querySelector("#add-form");
const nameInput = document.querySelector("#item-name");
const qtyInput = document.querySelector("#item-qty");
const errorMessage = document.querySelector("#error");
const itemList = document.querySelector("#item-list");
const remaining = document.querySelector("#remaining");
const emptyMessage = document.querySelector("#empty");

// Update "X items remaining" (only items that are not bought yet)
function updateRemaining() {
  const total = itemList.children.length;
  const count = itemList.querySelectorAll("li:not(.bought)").length;

  remaining.textContent = count + (count === 1 ? " item" : " items") + " remaining";
  emptyMessage.hidden = total > 0;
}

// Build one <li> with the name, quantity, Bought button and Delete button
function createItem(name, quantity) {
  const li = document.createElement("li");

  const nameSpan = document.createElement("span");
  nameSpan.className = "item-name";
  nameSpan.textContent = name;

  const qtySpan = document.createElement("span");
  qtySpan.className = "item-qty";
  qtySpan.textContent = "Qty: " + quantity;

  const boughtButton = document.createElement("button");
  boughtButton.type = "button";
  boughtButton.className = "btn btn-small";
  boughtButton.textContent = "Bought";
  boughtButton.addEventListener("click", function () {
    // The "bought" class gives a line-through and grey text (see styles.css)
    const isBought = li.classList.toggle("bought");
    boughtButton.textContent = isBought ? "Undo" : "Bought";
    updateRemaining();
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn btn-small btn-danger";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function () {
    li.remove();
    updateRemaining();
  });

  li.append(nameSpan, qtySpan, boughtButton, deleteButton);
  return li;
}

addForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stay on the page

  const name = nameInput.value.trim();
  const quantity = Number(qtyInput.value);

  if (name === "") {
    errorMessage.textContent = "Please enter an item name.";
    nameInput.focus();
    return;
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    errorMessage.textContent = "Quantity must be a whole number of at least 1.";
    qtyInput.focus();
    return;
  }

  errorMessage.textContent = "";
  itemList.appendChild(createItem(name, quantity));
  updateRemaining();

  // Reset the form, ready for the next item
  nameInput.value = "";
  qtyInput.value = 1;
  nameInput.focus();
});

// Clear the error as soon as the user starts fixing it
nameInput.addEventListener("input", function () {
  errorMessage.textContent = "";
});
qtyInput.addEventListener("input", function () {
  errorMessage.textContent = "";
});

updateRemaining();
