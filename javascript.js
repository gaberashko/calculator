const POSITIVE_RGB = "rgb(92, 163, 207)";
const NEGATIVE_RGB = "rgb(207, 92, 92)";

let calculatorButtons = Array.from(document.querySelectorAll(".button"));
// Stores the important facets of calculator operation.
let curA = null, curB = null, result = "", displayValue = "0";
let begin2ndOperand = false;
let curOperator = "";

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide (a, b) {
    return a / b;
}

function changeSigns(a) {
    return a * -1;
}

function performEvaluation() {
    curA = operate(Number(curA), Number(curB), curOperator);
    result = curA;
    curB = null;
    curOperator = "";
    begin2ndOperand = false;
    let evalAudio = new Audio("audio/eval-ding.mp3");
    evalAudio.play();
    return curA.toString();
}

function operate(a, b, operator) {
    a = a || 0;
    b = b || 0;
    switch (operator) {
        case "+":
            return add(a, b);
        case "-":
            return subtract(a, b);
        case "*":
            return multiply(a, b);
        case "/":
            return divide(a, b);
    }
}

function updateDisplay() {
    let coloredElements = document.querySelectorAll(".core-accent");
    let operators = document.querySelectorAll(".operator");

    const resultDisplay = document.querySelector(".result");
    resultDisplay.textContent = displayValue;
    if (displayValue.length > 9) {
        resultDisplay.textContent = displayValue.substring(0, 9);
    }
    // Adjust colors based on display value sign.
    if (displayValue < 0) {
        coloredElements.forEach((element) => {
            if (!element.classList.contains("negative")) {
                element.classList.toggle("negative"); 
            }
        });
        operators.forEach((element) => {
            if (!element.classList.contains("negative")) { element.classList.toggle("negative");
            }
        });
    } else {
        coloredElements.forEach((element) => {
            if (element.classList.contains("negative")) {
                element.classList.toggle("negative");
            }
        });
        operators.forEach((element) => {
            if (element.classList.contains("negative")) {
                element.classList.toggle("negative");
            }
        });
    }
}

function isOperator(input) {
    return input.classList.contains("operator");
}

function isOperand(input) {
    return input.classList.contains("operand");
}

function isEquals(input) {
    return input.classList.contains("equals");
}

function isClear(input) {
    return input.classList.contains("clear");
}

function isUndo(input) {
    return input.classList.contains("back");
}

function isDecimal(input) {
    return input.classList.contains("decimal");
}

function isSignChange(input) {
    return input.classList.contains("sign");
}

calculatorButtons.forEach((button) => button.addEventListener("click", (event) => {
    let buttonClickAudio = new Audio("audio/button-click.mp3");
    buttonClickAudio.play();
    let input = button.textContent;
    if (isEquals(button)) { // Attempt to evaluate.
        if (curA !== null) {
            curB = displayValue ?? curA ?? 0;
        }
        displayValue = performEvaluation();
    }
    if (isSignChange(button)) { // Change sign of current number.
        displayValue = changeSigns(displayValue).toString();
    }
    if (isClear(button)) { // User clear.
        curA = curB = result = curOperator = "";
        displayValue = "0";
    }
    if (isOperator(button)) { // User is inputting operator.
        if (curOperator === "") {
            // No operator selected. Store operator, and take store first operand.
            curOperator = input;
            curA = displayValue;
        } else { // Operator already selected.
            curB = displayValue;
            displayValue = performEvaluation();
            curOperator = input;
        }
        document.getElementById(button.id).focus();
    } else if (isOperand(button)) { // User is inputting a number
        if (displayValue === "0") { // First number in calculator
            displayValue = input;
        } else { // Not first number in calculator
            if (curOperator === "") { // No operator selected. Still first operand.
                displayValue += input;
            } else { // Operator selected. Begin second operand.
                if (displayValue === curA || curA === result) { // If a second operand hasn't been entered, begin.
                    if (begin2ndOperand) {
                        displayValue = input;
                    } else {
                        displayValue += input;
                    }
                    if (curA ===  result) {
                        begin2ndOperand = true;
                    }
                    if (result !== null) {
                        displayValue = input;
                        result = null;
                    }
                } else {
                    displayValue += input;
                }
            }
        }
    } else if (isUndo(button)) { // User backspacing.
        if (displayValue !== "0") { // Display is populated with some value
            if (result !== null) { // Evaluation just occurred.
                displayValue = "0";
            } else { // Evaluation didn't just occur. Remove a digit.
                displayValue = (displayValue.length === 1) ? 
                "0" : displayValue.substring(0, displayValue.length - 1);
            }
        } // Display is not populated. Do nothing.
    }
    if (isDecimal(button)) {
        if (!displayValue.includes(".")) {
            displayValue += input;
        }
    }
    

    updateDisplay();
}));

window.addEventListener("keydown", (event) => {
    let button;
    if (event.shiftKey) { // Shift pressed, look for operators.
        let operatorChosen = "";
        switch (event.code) {
            case "Digit8":
                operatorChosen = "multiply";
                break;
            case "Equal":
                operatorChosen = "add";
                break;
            case "Slash":
                operatorChosen = "divide";
                break;
            case "Semicolon":
                operatorChosen = "sign";
                break;
        }
        button = document.getElementById(`${operatorChosen}`)
    } else {
        button = document.getElementById(`${event.code}`);
    }
    if (button) {
        document.activeElement.blur();
        button.click();
        
    }
});