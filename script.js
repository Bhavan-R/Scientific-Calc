class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
        this.memory = 0;
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                computation = current === 0 ? 'Error' : prev / current;
                break;
            case 'power':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    scientificOperation(action) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;

        switch (action) {
            case 'sqrt':
                this.currentOperand = Math.sqrt(current).toString();
                break;
            case 'percent':
                this.currentOperand = (current / 100).toString();
                break;
            case 'power':
                this.chooseOperation('power');
                break;
            default:
                return;
        }
    }

    memoryOperation(action) {
        const current = parseFloat(this.currentOperand);
        switch (action) {
            case 'mc':
                this.memory = 0;
                break;
            case 'mr':
                this.currentOperand = this.memory.toString();
                break;
            case 'm-plus':
                if (!isNaN(current)) this.memory += current;
                break;
            case 'm-minus':
                if (!isNaN(current)) this.memory -= current;
                break;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandElement.innerText =
                `${this.previousOperand} ${this.getOperationSymbol(this.operation)}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    getOperationSymbol(op) {
        switch (op) {
            case 'add': return '+';
            case 'subtract': return '−';
            case 'multiply': return '×';
            case 'divide': return '÷';
            case 'power': return '^';
            default: return '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-action]');
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandElement, currentOperandElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;

        if (action === 'calculate') {
            calculator.compute();
            calculator.updateDisplay();
        } else if (action === 'clear') {
            calculator.clear();
            calculator.updateDisplay();
        } else if (['sqrt', 'percent', 'power'].includes(action)) {
            calculator.scientificOperation(action);
            calculator.updateDisplay();
        } else if (['mc', 'mr', 'm-plus', 'm-minus'].includes(action)) {
            calculator.memoryOperation(action);
            calculator.updateDisplay();
        } else {
            calculator.chooseOperation(action);
            calculator.updateDisplay();
        }
    });
});
