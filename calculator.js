// Task 3: Calculator (with keyboard support bonus)
// Operations are chained step by step: 5 + 3 × 2 = (5 + 3) × 2 = 16

const MAX_DIGITS = 15;

const expressionDisplay = document.querySelector("#expression");
const valueDisplay = document.querySelector("#value");
const keysContainer = document.querySelector("#keys");

// What each operator does. Dividing by zero returns null, which means "error".
const operations = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => (b === 0 ? null : a / b),
};

// ---------- State ----------
let currentInput = ""; // the number being typed, as text
let previousNumber = null; // the number before the operator
let operator = null; // "+", "-", "×" or "÷"
let justEvaluated = false; // true right after "=" was pressed
let lastExpression = ""; // shown after "=", e.g. "5 + 3 ="
let hasError = false;

// ---------- Helpers ----------

// Round away floating point noise, so 0.1 + 0.2 shows 0.3
function formatNumber(number) {
  return String(parseFloat(number.toFixed(10)));
}

function calculate(a, b, op) {
  const result = operations[op](a, b);
  if (result === null || !Number.isFinite(result)) return null;
  return result;
}

function showError() {
  hasError = true;
  currentInput = "";
  previousNumber = null;
  operator = null;
  justEvaluated = false;
  lastExpression = "";
}

function render() {
  if (hasError) {
    expressionDisplay.textContent = "";
    valueDisplay.textContent = "Error";
    return;
  }

  // Top line: the pending operation, or the finished one after "="
  if (operator !== null) {
    expressionDisplay.textContent = formatNumber(previousNumber) + " " + operator;
  } else {
    expressionDisplay.textContent = lastExpression;
  }

  // Main line: what the user is typing, or the number waiting for its next operand
  if (currentInput !== "") {
    valueDisplay.textContent = currentInput;
  } else if (previousNumber !== null) {
    valueDisplay.textContent = formatNumber(previousNumber);
  } else {
    valueDisplay.textContent = "0";
  }
}

// ---------- Actions ----------

function clearAll() {
  currentInput = "";
  previousNumber = null;
  operator = null;
  justEvaluated = false;
  lastExpression = "";
  hasError = false;
}

function inputDigit(digit) {
  // Typing after a result or an error starts a fresh calculation
  if (hasError || justEvaluated) clearAll();
  if (currentInput.length >= MAX_DIGITS) return;

  // Avoid leading zeros like "007"
  currentInput = currentInput === "0" ? digit : currentInput + digit;
  lastExpression = "";
}

function inputDecimal() {
  if (hasError || justEvaluated) clearAll();
  if (currentInput.includes(".")) return; // only one decimal point per number

  currentInput = currentInput === "" ? "0." : currentInput + ".";
  lastExpression = "";
}

function chooseOperator(newOperator) {
  if (hasError) return;

  if (currentInput !== "") {
    const value = parseFloat(currentInput);

    if (previousNumber !== null && operator !== null) {
      // Chained operation: finish the previous step first (5 + 3 × ... -> 8 ×)
      const result = calculate(previousNumber, value, operator);
      if (result === null) {
        showError();
        return;
      }
      previousNumber = result;
    } else {
      previousNumber = value;
    }
    currentInput = "";
  } else if (previousNumber === null) {
    return; // nothing to operate on yet
  }

  // If an operator was already waiting, this simply swaps it for the new one
  operator = newOperator;
  justEvaluated = false;
  lastExpression = "";
}

function evaluate() {
  if (hasError || operator === null || currentInput === "") return;

  const value = parseFloat(currentInput);
  const result = calculate(previousNumber, value, operator);
  if (result === null) {
    showError();
    return;
  }

  lastExpression = formatNumber(previousNumber) + " " + operator + " " + currentInput + " =";
  currentInput = formatNumber(result);
  previousNumber = null;
  operator = null;
  justEvaluated = true;
}

function backspace() {
  if (hasError) {
    clearAll();
    return;
  }
  if (justEvaluated) return;
  currentInput = currentInput.slice(0, -1);
}

// ---------- Buttons (generated in JavaScript) ----------

// Each button: label, the action it runs, and optional extra CSS classes
const buttons = [
  { label: "C", action: clearAll, classes: "key-clear" },
  { label: "÷", action: () => chooseOperator("÷"), classes: "key-operator" },

  { label: "7", action: () => inputDigit("7") },
  { label: "8", action: () => inputDigit("8") },
  { label: "9", action: () => inputDigit("9") },
  { label: "×", action: () => chooseOperator("×"), classes: "key-operator" },

  { label: "4", action: () => inputDigit("4") },
  { label: "5", action: () => inputDigit("5") },
  { label: "6", action: () => inputDigit("6") },
  { label: "-", action: () => chooseOperator("-"), classes: "key-operator" },

  { label: "1", action: () => inputDigit("1") },
  { label: "2", action: () => inputDigit("2") },
  { label: "3", action: () => inputDigit("3") },
  { label: "+", action: () => chooseOperator("+"), classes: "key-operator" },

  { label: "0", action: () => inputDigit("0"), classes: "key-wide" },
  { label: ".", action: inputDecimal },
  { label: "=", action: evaluate, classes: "key-equals" },
];

for (const { label, action, classes } of buttons) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "key" + (classes ? " " + classes : "");
  button.textContent = label;

  button.addEventListener("click", function () {
    action();
    render();
  });

  keysContainer.appendChild(button);
}

// ---------- Keyboard support (bonus) ----------

document.addEventListener("keydown", function (event) {
  // Leave browser shortcuts such as Ctrl+C alone
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  const key = event.key;

  if (key >= "0" && key <= "9" && key.length === 1) {
    inputDigit(key);
  } else if (key === ".") {
    inputDecimal();
  } else if (key === "+") {
    chooseOperator("+");
  } else if (key === "-") {
    chooseOperator("-");
  } else if (key === "*") {
    chooseOperator("×");
  } else if (key === "/") {
    chooseOperator("÷");
  } else if (key === "Enter" || key === "=") {
    evaluate();
  } else if (key === "Escape" || key === "c" || key === "C") {
    clearAll();
  } else if (key === "Backspace") {
    backspace();
  } else {
    return; // not a calculator key
  }

  // Stops "/" opening quick-find, and Enter re-clicking a focused button
  event.preventDefault();
  render();
});

render();
