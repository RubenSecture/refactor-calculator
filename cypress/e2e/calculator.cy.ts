/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    clickCalculatorButton(value: string): Chainable<Subject>
    clearCalculator(): Chainable<Subject>
    performCalculation(num1: string, operator: string, num2: string): Chainable<Subject>
  }
}

describe("Calculator E2E Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    // Handle uncaught exceptions from the application
    cy.on("uncaught:exception", err => {
      // Return false to prevent Cypress from failing the test on division by zero
      return false;
    });
  });

  it("performs basic arithmetic operations", () => {
    // Test addition
    cy.log("Starting addition test");
    // Check if buttons exist first
    cy.get('[data-test="number-7"]').should("exist");
    cy.get('[data-test="add-button"]').should("exist");
    cy.get('[data-test="number-3"]').should("exist");
    cy.get('[data-test="equals-button"]').should("exist");

    // Click buttons and verify after each click
    cy.get('[data-test="number-7"]').click();
    cy.get(".component-display").should("contain", "7");

    cy.get('[data-test="add-button"]').click();
    cy.get(".component-display").should("contain", "7");

    cy.get('[data-test="number-3"]').click();
    cy.get(".component-display").should("contain", "3");

    cy.get('[data-test="equals-button"]').click();
    cy.get(".component-display").should("contain", "10");

    // Test multiplication
    cy.log("Starting multiplication test");
    cy.get('[data-test="clear-button"]').click();
    cy.get(".component-display").should("contain", "0");

    cy.get('[data-test="number-4"]').click();
    cy.get(".component-display").should("contain", "4");

    cy.get('[data-test="multiply-button"]').click();
    cy.get(".component-display").should("contain", "4");

    cy.get('[data-test="number-5"]').click();
    cy.get(".component-display").should("contain", "5");

    cy.get('[data-test="equals-button"]').click();
    cy.get(".component-display").should("contain", "20");
  });

  it("handles decimal numbers", () => {
    cy.clickCalculatorButton("5");
    cy.clickCalculatorButton(".");
    cy.clickCalculatorButton("5");
    cy.clickCalculatorButton("+");
    cy.clickCalculatorButton("2");
    cy.clickCalculatorButton(".");
    cy.clickCalculatorButton("5");
    cy.clickCalculatorButton("=");
    cy.get(".component-display", { timeout: 10000 }).should("contain", "8");
  });

  it("handles negative numbers", () => {
    cy.clickCalculatorButton("5");
    cy.clickCalculatorButton("+/-");
    cy.get(".component-display", { timeout: 10000 }).should("contain", "-5");
  });

  it("clears the display", () => {
    cy.clickCalculatorButton("5");
    cy.clearCalculator();
  });

  it("handles multiple operations in sequence", () => {
    cy.clickCalculatorButton("7");
    cy.clickCalculatorButton("+");
    cy.clickCalculatorButton("3");
    cy.clickCalculatorButton("x");
    cy.clickCalculatorButton("2");
    cy.clickCalculatorButton("=");
    cy.get(".component-display", { timeout: 10000 }).should("contain", "20");
  });

  it("handles division by zero", () => {
    cy.performCalculation("5", "÷", "0");
    // Since your app shows '0' when dividing by zero and shows an alert
    cy.get(".component-display", { timeout: 10000 }).should("contain", "0");
  });
});
