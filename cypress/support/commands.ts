/// <reference types="cypress" />
/// <reference path="./index.d.ts" />

// Custom command to click a calculator button
Cypress.Commands.add("clickCalculatorButton", (value: string) => {
  const buttonMap: { [key: string]: string } = {
    "0": "number-0",
    "1": "number-1",
    "2": "number-2",
    "3": "number-3",
    "4": "number-4",
    "5": "number-5",
    "6": "number-6",
    "7": "number-7",
    "8": "number-8",
    "9": "number-9",
    "+": "add-button",
    "-": "subtract-button",
    "x": "multiply-button",
    "÷": "divide-button",
    "=": "equals-button",
    ".": "decimal-button",
    "AC": "clear-button",
    "+/-": "negate-button",
    "%": "percent-button"
  };

  const dataTest = buttonMap[value];
  if (!dataTest) {
    throw new Error(`Unknown button value: ${value}`);
  }

  cy.get(`[data-test="${dataTest}"]`).click();
});

// Custom command to verify display value
Cypress.Commands.add("verifyDisplay", (expectedValue: string) => {
  cy.get(".component-display", { timeout: 10000 }).should(
    "contain",
    expectedValue,
  );
});

// Custom command to perform a calculation
Cypress.Commands.add(
  "performCalculation",
  (num1: string, operator: string, num2: string) => {
    cy.clickCalculatorButton(num1);
    cy.clickCalculatorButton(operator);
    cy.clickCalculatorButton(num2);
    cy.clickCalculatorButton("=");
  },
);

// Custom command to clear calculator
Cypress.Commands.add("clearCalculator", () => {
  cy.clickCalculatorButton("AC");
  cy.verifyDisplay("0");
});
