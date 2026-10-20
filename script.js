const screen = document.getElementById("screen");
const history = document.getElementById("history");
const keys = document.querySelector(".keys");

let current = "0";
let previous = null;
let operator = null;
let resetNext = false;

function updateScreen() {
    screen.textContent = current;
}

function formatNumber(number) {
    if (!Number.isFinite(number)) {
        return "Error";
    }

    return String(Number(number.toPrecision(12)));
}

function inputNumber(number) {
    if (current === "Error" || resetNext) {
        current = number;
        resetNext = false;
    } else if (current === "0") {
        current = number;
    } else if (current.replace("-", "").length < 15) {
        current += number;
    }

    updateScreen();
}

function inputDecimal() {
    if (current === "Error" || resetNext) {
        current = "0.";
        resetNext = false;
    } else if (!current.includes(".")) {
        current += ".";
    }

    updateScreen();
}

function clearAll() {
    current = "0";
    previous = null;
    operator = null;
    resetNext = false;

    history.textContent = "Ready to calculate";
    updateScreen();
}

function deleteLast() {
    if (current === "Error" || resetNext) {
        current = "0";
        resetNext = false;
    } else {
        current = current.slice(0, -1);

        if (current === "" || current === "-") {
            current = "0";
        }
    }

    updateScreen();
}

function toggleSign() {
    if (current === "Error") return;

    current = String(-Number(current));
    updateScreen();
}

function percentage() {
    if (current === "Error") return;

    current = formatNumber(Number(current) / 100);
    updateScreen();
}

function calculate(a, b, op) {
    switch (op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return b === 0 ? NaN : a / b;
        default: return b;
    }
}

function chooseOperator(nextOperator) {
    if (current === "Error") return;

    const value = Number(current);

    if (operator && !resetNext) {
        const result = calculate(previous, value, operator);
        current = formatNumber(result);
        updateScreen();

        if (current === "Error") {
            previous = null;
            operator = null;
            resetNext = true;
            history.textContent = "Invalid calculation";
            return;
        }
    }

    previous = Number(current);
    operator = nextOperator;
    resetNext = true;

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    history.textContent =
        `${formatNumber(previous)} ${symbols[operator]}`;
}

function equals() {
    if (operator === null || previous === null || current === "Error") {
        return;
    }

    const a = previous;
    const b = Number(current);
    const op = operator;

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    history.textContent =
        `${formatNumber(a)} ${symbols[op]} ${formatNumber(b)} =`;

    current = formatNumber(calculate(a, b, op));

    previous = null;
    operator = null;
    resetNext = true;

    updateScreen();
}

keys.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.number !== undefined) {
        inputNumber(button.dataset.number);
        return;
    }

    if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
        return;
    }

    switch (button.dataset.action) {
        case "clear":
            clearAll();
            break;

        case "delete":
            deleteLast();
            break;

        case "decimal":
            inputDecimal();
            break;

        case "sign":
            toggleSign();
            break;

        case "percent":
            percentage();
            break;

        case "equals":
            equals();
            break;
    }
});

// Keyboard support: numbers, operators, Enter, Backspace and Escape.
document.addEventListener("keydown", function (event) {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
    } else if (key === ".") {
        inputDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        equals();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape") {
        clearAll();
    } else if (key === "%") {
        percentage();
    }
});