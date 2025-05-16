# Comprehensive React Testing Guide

This guide brings together the different testing strategies for your React 19 refactoring project. By following these guidelines, you can ensure that your application maintains its functionality during the migration from class components to functional components.

## Testing Pyramid

We follow the testing pyramid approach with three layers:

1. **Unit Tests** - Testing individual components in isolation
2. **Integration Tests** - Testing how components work together
3. **E2E Tests** - Testing entire user flows through the UI

```
    /\
   /  \
  /    \     E2E Tests (Cypress)
 /      \
/        \
----------
\        /
 \      /     Integration Tests (React Testing Library)
  \    /
   \  /
    \/
----------
|        |
|        |     Unit Tests (React Testing Library)
|        |
----------
```

## Testing Workflow for Component Refactoring

### Step 1: Component Analysis
- Identify component dependencies
- Document props and state
- Note lifecycle methods used
- Plan testing approach based on component complexity

### Step 2: Test Coverage Creation
1. **Unit Tests**: 
   - Create tests for the component in isolation
   - Follow [UNIT_TESTING_RULES.md](./UNIT_TESTING_RULES.md)
   
2. **Integration Tests**:
   - Test the component with related components
   - Follow [INTEGRATION_TESTING_RULES.md](./INTEGRATION_TESTING_RULES.md)

3. **E2E Tests**:
   - Test the component in user workflows
   - Follow [CYPRESS_E2E_TESTING_RULES.md](./CYPRESS_E2E_TESTING_RULES.md)

### Step 3: Verify Existing Behavior
- Run all tests against the current implementation
- Confirm tests pass and accurately capture current behavior
- Fix any test issues before proceeding with refactoring

### Step 4: Component Refactoring
- Refactor the component to a functional component with hooks
- Follow [REFACTORING_RULES.md](./REFACTORING_RULES.md)
- Use TypeScript for type safety

### Step 5: Test Verification
- Run all tests against the refactored component
- Fix any issues that arise
- Ensure all tests pass with the same behavior

### Step 6: Documentation
- Document any changes to the component API
- Update component usage examples if needed
- Note any performance improvements or other changes

## Test Coverage Requirements

For each component, aim for the following coverage:

### Unit Tests
- 90%+ coverage of component logic
- Tests for all props and their effects
- Tests for all user interactions
- Tests for conditional rendering

### Integration Tests
- Tests for all component interactions
- Tests for context/state management
- Tests for data flow between components

### E2E Tests
- Tests for critical user flows
- Tests for edge cases in the UI
- Regression tests for key functionality

## When to Use Each Testing Approach

### Unit Tests
- When testing a single component's functionality
- When testing specific component methods or states
- When testing UI rendering logic

### Integration Tests
- When testing interactions between components
- When testing context or state management
- When testing data flow between components

### E2E Tests
- When testing complete user workflows
- When testing critical business processes
- When testing across multiple pages/routes

## Folder Structure

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx                  # Component code
│   │   ├── Button.test.tsx             # Unit tests
│   │   ├── Button.integration.test.tsx # Integration tests
│   │   └── Button.module.css           # Component styles
│   └── ...
├── pages/
│   └── ...
└── cypress/
    ├── e2e/
    │   ├── calculator.cy.ts            # E2E tests for calculator
    │   └── ...
    └── support/
        ├── commands.ts                 # Custom Cypress commands
        └── ...
```

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io)
- [TypeScript Testing Guide](https://www.typescriptlang.org/docs/handbook/testing.html)
- [Testing React Applications](https://reactjs.org/docs/testing.html) 