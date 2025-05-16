// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      clickCalculatorButton(value: string): Chainable<Subject>
      verifyDisplay(expectedValue: string): Chainable<Subject>
      performCalculation(num1: string, operator: string, num2: string): Chainable<Subject>
      clearCalculator(): Chainable<Subject>
    }
  }
}

// Hide fetch/XHR requests from command log
const app = window.top;
if (
  app &&
  !app.document.head.querySelector("[data-hide-command-log-request]")
) {
  const style = app.document.createElement("style");
  style.innerHTML =
    ".command-name-request, .command-name-xhr { display: none }";
  style.setAttribute("data-hide-command-log-request", "");
  app.document.head.appendChild(style);
}
