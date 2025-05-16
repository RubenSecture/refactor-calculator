# Cypress E2E Testing Guide

## Pre-requisites
- Cypress installed and configured
- TypeScript setup complete
- Application running locally or in a test environment
- Components to be tested are accessible via the UI

## Step-by-Step E2E Testing Process

### 1. TypeScript Configuration and Setup
- [ ] Install necessary TypeScript dependencies:
  ```bash
  npm install --save-dev typescript @types/node @types/mocha @types/cypress
  ```
- [ ] Add TypeScript references at the top of your test files:
  ```typescript
  /// <reference types="cypress" />
  ```
- [ ] Configure TypeScript compiler options in `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "target": "es5",
      "lib": ["es5", "dom"],
      "types": ["cypress", "node"],
      "resolveJsonModule": true,
      "esModuleInterop": true
    },
    "include": ["**/*.ts"]
  }
  ```
- [ ] Set up proper type declarations in `cypress/support/e2e.ts`:
  ```typescript
  declare global {
    namespace Cypress {
      interface Chainable<Subject = any> {
        // Add your custom commands here
        customCommand(param: string): Chainable<Subject>
        // Example with multiple parameters
        anotherCommand(param1: string, param2: number): Chainable<Subject>
      }
    }
  }
  ```
- [ ] Add type references in `cypress/support/commands.ts`:
  ```typescript
  /// <reference types="cypress" />
  /// <reference path="./index.d.ts" /> // If you have additional type definitions
  ```

### 2. Test Environment Setup
- [ ] Configure Cypress in `cypress.config.ts`:
  ```typescript
  import { defineConfig } from 'cypress';

  export default defineConfig({
    e2e: {
      baseUrl: 'http://localhost:3000',
      viewportWidth: 1280,
      viewportHeight: 720,
      video: true,
      screenshotOnRunFailure: true,
      supportFile: 'cypress/support/e2e.ts', // Note .ts extension
    },
  });
  ```
- [ ] Set up test support files:
  - `cypress/support/e2e.ts` for global configurations and type declarations
  - `cypress/support/commands.ts` for custom commands implementation
  - Optional: `cypress/support/index.d.ts` for shared type definitions

### 2. Custom Command Creation
- [ ] Create type-safe custom commands with proper TypeScript definitions:
  ```typescript
  // In commands.ts
  Cypress.Commands.add('login', (username: string, password: string) => {
    cy.visit('/login');
    cy.get('[data-test="username"]').type(username);
    cy.get('[data-test="password"]').type(password);
    cy.get('[data-test="submit"]').click();
  });

  // In e2e.ts
  declare global {
    namespace Cypress {
      interface Chainable<Subject = any> {
        login(username: string, password: string): Chainable<Subject>
      }
    }
  }
  ```

### 3. Test Organization
- [ ] Create test files with naming convention `featureName.cy.ts`
- [ ] Group tests by feature/component using `describe` blocks
- [ ] Use `beforeEach` for common setup
- [ ] Structure tests in order of user flow:
  ```typescript
  describe('Shopping Cart', () => {
    beforeEach(() => {
      cy.visit('/products');
    });

    it('adds product to cart', () => {
      // Test steps...
    });

    it('updates product quantity', () => {
      // Test steps...
    });

    it('removes product from cart', () => {
      // Test steps...
    });
  });
  ```

### 4. Element Selection Best Practices
- [ ] Always use data-test attributes for test elements:
  ```typescript
  // In your React component
  <Button data-test="submit-button" onClick={handleSubmit}>Submit</Button>

  // In your test
  cy.get('[data-test="submit-button"]').click();
  ```
- [ ] Follow a consistent naming convention for data-test attributes:
  ```typescript
  // Component specific
  data-test="navbar-menu"
  data-test="sidebar-toggle"
  
  // Action specific
  data-test="submit-button"
  data-test="cancel-button"
  
  // Form field specific
  data-test="username-input"
  data-test="password-field"
  
  // Dynamic elements
  data-test="user-row-${id}"
  data-test="product-card-${index}"
  ```
- [ ] Avoid selecting by:
  - CSS classes (may change with styling updates)
  - XPath (brittle and hard to maintain)
  - Element tags (too generic)
  - Text content (may change with translations)
- [ ] Use chaining with data attributes to narrow down selections:
  ```typescript
  cy.get('[data-test="product-list"]')
    .find('[data-test="product-item"]')
    .first()
    .find('[data-test="add-to-cart"]')
    .click();
  ```
- [ ] Add data attributes in development, not just for tests:
  ```typescript
  // Component props interface
  interface ButtonProps {
    'data-test'?: string;
    onClick: () => void;
    children: React.ReactNode;
  }

  // Component implementation
  const Button: React.FC<ButtonProps> = ({ 'data-test': dataTest, onClick, children }) => (
    <button data-test={dataTest} onClick={onClick}>
      {children}
    </button>
  );
  ```

### 5. Assertions and Verifications
- [ ] Verify page state after actions
- [ ] Check UI elements render correctly
- [ ] Validate data persistence where relevant
- [ ] Test both positive paths and error states
- [ ] Examples:
  ```typescript
  // Element existence
  cy.get('[data-test="cart-item"]').should('exist');
  
  // Element count
  cy.get('[data-test="cart-item"]').should('have.length', 3);
  
  // Text content
  cy.get('[data-test="total-price"]').should('contain', '$42.00');
  
  // Element state
  cy.get('[data-test="checkout-button"]').should('not.be.disabled');
  
  // URL validation
  cy.url().should('include', '/checkout');
  ```

### 6. Testing User Workflows
- [ ] Test complete end-to-end user flows
- [ ] Break complex workflows into smaller test cases
- [ ] Simulate realistic user behavior
- [ ] Include waiting for network responses
- [ ] Example:
  ```typescript
  it('completes checkout process', () => {
    // Add item to cart
    cy.get('[data-test="product-1"]').find('[data-test="add-button"]').click();
    
    // Go to cart
    cy.get('[data-test="cart-icon"]').click();
    
    // Verify item in cart
    cy.get('[data-test="cart-items"]').should('have.length', 1);
    
    // Proceed to checkout
    cy.get('[data-test="checkout-button"]').click();
    
    // Fill shipping information
    cy.get('[data-test="shipping-form"]').within(() => {
      cy.get('input[name="name"]').type('John Doe');
      cy.get('input[name="address"]').type('123 Test St');
      // Fill other fields...
    });
    
    // Submit order
    cy.get('[data-test="place-order"]').click();
    
    // Verify success
    cy.get('[data-test="order-confirmation"]').should('contain', 'Thank you for your order');
  });
  ```

### 7. API Testing
- [ ] Intercept and mock API calls where appropriate
- [ ] Test different API response scenarios
- [ ] Verify UI updates based on API responses
- [ ] Examples:
  ```typescript
  // Intercept API call
  cy.intercept('GET', '/api/products', { fixture: 'products.json' }).as('getProducts');
  
  // Visit page that makes the API call
  cy.visit('/products');
  
  // Wait for API call to complete
  cy.wait('@getProducts');
  
  // Test failure scenario
  cy.intercept('POST', '/api/checkout', {
    statusCode: 500,
    body: { error: 'Server error' }
  }).as('checkoutError');
  
  // Verify error handling
  cy.get('[data-test="checkout-button"]').click();
  cy.wait('@checkoutError');
  cy.get('[data-test="error-message"]').should('be.visible');
  ```

### 8. Test Debugging Techniques
- [ ] Use `cy.log()` for debugging information
- [ ] Enable screenshots and videos for failed tests
- [ ] Use `.debug()` to pause test execution
- [ ] Save DOM snapshots at critical points
- [ ] Examples:
  ```typescript
  // Add log message
  cy.log('About to click checkout button');
  
  // Debug pause in test
  cy.get('[data-test="checkout-form"]').then(($form) => {
    if ($form.find('.error').length > 0) {
      cy.debug();
    }
  });
  
  // Take screenshot
  cy.screenshot('before-checkout');
  ```

## Best Practices
1. Write tests that focus on user behavior, not implementation details
2. Test the happy path first, then edge cases
3. Keep tests independent - each test should be able to run in isolation
4. Use meaningful test and fixture data
5. Avoid unnecessary waiting - Cypress has built-in retry and wait logic
6. Break large tests into smaller, focused tests
7. Use custom commands for repetitive actions
8. Follow the page object pattern for larger applications

## Test Performance Tips
1. Minimize the number of page loads (use `beforeEach` wisely)
2. Use application state preservation where possible
3. Consider using API calls to set up test data instead of UI interactions
4. Batch assertions instead of making multiple separate assertions
5. Use `.within()` to scope commands to specific elements
6. Run tests in parallel when possible

## Common Cypress Commands
- **Navigation**:
  - `cy.visit('/path')` - Visit a page
  - `cy.go('back')` - Navigate back
  - `cy.reload()` - Reload the page

- **Finding Elements**:
  - `cy.get('selector')` - Get elements by selector
  - `cy.contains('text')` - Get elements containing text
  - `cy.find('selector')` - Find elements within a parent

- **Actions**:
  - `cy.click()` - Click an element
  - `cy.type('text')` - Type into an input
  - `cy.check()` / `cy.uncheck()` - Check/uncheck checkboxes
  - `cy.select('option')` - Select dropdown option
  - `cy.clear()` - Clear input field
  - `cy.submit()` - Submit a form

- **Assertions**:
  - `cy.should('exist')` - Element exists
  - `cy.should('be.visible')` - Element is visible
  - `cy.should('have.text', 'text')` - Has specific text
  - `cy.should('have.class', 'class')` - Has CSS class
  - `cy.should('have.attr', 'attr', 'value')` - Has attribute
  - `cy.should('have.length', n)` - Has n elements

- **Network**:
  - `cy.request()` - Make HTTP request
  - `cy.intercept()` - Intercept network requests
  - `cy.wait('@alias')` - Wait for intercepted request 

## TypeScript Best Practices
1. **Type Safety in Tests**
   ```typescript
   // Use type assertions when needed
   cy.get('[data-test="element"]').then(($el) => {
     const text = $el.text() as string;
     expect(text).to.match(/expected pattern/);
   });

   // Type your test data
   interface TestUser {
     username: string;
     password: string;
   }

   const testUser: TestUser = {
     username: 'test@example.com',
     password: 'password123'
   };
   ```

2. **Custom Command Type Safety**
   ```typescript
   // Define return types for commands that return values
   Cypress.Commands.add('getText', { prevSubject: true }, (subject: JQuery) => {
     return subject.text();
   });

   declare global {
     namespace Cypress {
       interface Chainable<Subject = any> {
         getText(): Chainable<string>
       }
     }
   }
   ```

3. **Fixture Type Safety**
   ```typescript
   // Define types for your fixtures
   interface UserFixture {
     users: Array<{
       id: number;
       name: string;
       email: string;
     }>;
   }

   cy.fixture('users.json').then((data: UserFixture) => {
     // TypeScript now knows the shape of your data
     data.users.forEach(user => {
       expect(user.id).to.be.a('number');
     });
   });
   ```

4. **API Intercept Type Safety**
   ```typescript
   interface ApiResponse {
     status: number;
     data: {
       id: string;
       value: number;
     };
   }

   cy.intercept('GET', '/api/data', (req) => {
     req.reply({
       statusCode: 200,
       body: {
         id: '123',
         value: 42
       } as ApiResponse['data']
     });
   });
   ```

## Common TypeScript Gotchas and Solutions
1. **Handling `null` Assertions**
   ```typescript
   // Use non-null assertion when you're sure element exists
   cy.get('[data-test="element"]').then($el => {
     const element = $el[0]!; // Use ! when you're sure it's not null
   });
   ```

2. **Working with Custom Attributes**
   ```typescript
   // Extend JQuery interface for custom data attributes
   declare namespace Cypress {
     interface JQuery {
       customAttr(): string;
     }
   }
   ```

3. **Type-safe Aliases**
   ```typescript
   // Setting and getting aliases with types
   cy.get('[data-test="element"]').as('myElement');
   cy.get('@myElement').then(($el: JQuery<HTMLElement>) => {
     // $el is properly typed
   });
   ``` 