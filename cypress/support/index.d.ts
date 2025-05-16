declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to click a calculator button
     * @example cy.clickCalculatorButton('7')
     */
    clickCalculatorButton(value: string): Chainable<void>;

    /**
     * Custom command to verify calculator display value
     * @example cy.verifyDisplay('42')
     */
    verifyDisplay(expectedValue: string): Chainable<void>;

    /**
     * Custom command to perform a calculation
     * @example cy.performCalculation('7', '+', '3')
     */
    performCalculation(
      num1: string,
      operator: string,
      num2: string,
    ): Chainable<void>;

    /**
     * Custom command to clear calculator
     * @example cy.clearCalculator()
     */
    clearCalculator(): Chainable<void>;
  }
}
