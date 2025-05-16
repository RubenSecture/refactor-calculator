# React Class to Functional Component Refactoring Guide

## Pre-requisites
- Ensure all dependencies are updated to React 19
- Install TypeScript and type definitions
- Install testing libraries:
  - Unit Tests: @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
  - E2E Tests: Cypress
- Configure TypeScript (`tsconfig.json`)
- Update build pipeline for TypeScript support

## Step-by-Step Refactoring Process

### 1. Component Analysis
- [ ] Identify the component's dependencies
- [ ] List all props and their types
- [ ] Document the component's state management
- [ ] Note any lifecycle methods being used
- [ ] Identify potential TypeScript interfaces/types needed

### 2. Test Creation (Three Layers)

#### 2.1 Unit Tests (`ComponentName.test.tsx`)
- [ ] Create test file with TypeScript support
- [ ] Write component-level tests:
  - Rendering tests
  - Props tests
  - Event handler tests
  - State change tests
  - Edge cases
- [ ] Run tests to ensure they pass with current implementation

#### 2.2 Integration Tests (`ComponentName.integration.test.tsx`)
- [ ] Test component interactions with others
- [ ] Test data flow between components
- [ ] Test context/redux state changes
- [ ] Test routing if applicable

#### 2.3 E2E Tests (`cypress/e2e/ComponentName.cy.ts`)
- [ ] Test real user workflows
- [ ] Test component in actual browser environment
- [ ] Example E2E test structure:
  ```typescript
  describe('Calculator Button Component', () => {
    beforeEach(() => {
      cy.visit('/');  // Visit your app's URL
    });

    it('performs calculation with button clicks', () => {
      // Test a complete calculation workflow
      cy.get('button').contains('7').click();
      cy.get('button').contains('+').click();
      cy.get('button').contains('3').click();
      cy.get('button').contains('=').click();
      cy.get('.component-display').should('contain', '10');
    });

    it('handles multiple operations', () => {
      // Test complex calculations
      cy.get('button').contains('4').click();
      cy.get('button').contains('x').click();
      cy.get('button').contains('5').click();
      cy.get('button').contains('+').click();
      cy.get('button').contains('3').click();
      cy.get('button').contains('=').click();
      cy.get('.component-display').should('contain', '23');
    });
  });
  ```

### 3. Component Refactoring to TypeScript
- [ ] Rename file to `.tsx` extension
- [ ] Define interfaces for props and state:
  ```typescript
  interface ComponentProps {
    propertyName: string;
    optionalProp?: number;
    callback: (param: string) => void;
  }

  interface ComponentState {
    data: Array<DataType>;
    loading: boolean;
  }
  ```
- [ ] Convert class component to functional component
- [ ] Replace PropTypes with TypeScript types
- [ ] Convert class methods to functions with proper typing
- [ ] Add proper return types to functions
- [ ] Type event handlers correctly:
  ```typescript
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Handler implementation
  };
  ```

### 4. Hooks Implementation
- [ ] Replace lifecycle methods with hooks:
  ```typescript
  // Instead of componentDidMount
  useEffect(() => {
    // Effect code
  }, []);

  // Instead of componentDidUpdate
  useEffect(() => {
    // Effect code
  }, [dependencies]);

  // Instead of componentWillUnmount
  useEffect(() => {
    return () => {
      // Cleanup code
    };
  }, []);
  ```
- [ ] Convert state management:
  ```typescript
  // Simple state
  const [value, setValue] = useState<string>("");

  // Complex state
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, initialState);
  ```
- [ ] Implement performance optimizations:
  ```typescript
  // Memoize expensive calculations
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

  // Memoize callbacks
  const memoizedCallback = useCallback((param: string) => {
    doSomething(param);
  }, [/* dependencies */]);
  ```

### 5. Testing and Validation
- [ ] Run all test suites:
  ```bash
  # Unit and integration tests
  npm test

  # E2E tests
  npm run cypress:run
  ```
- [ ] Manual testing checklist:
  - Component renders correctly
  - All interactions work
  - No TypeScript errors
  - No console errors
  - Performance is acceptable
- [ ] Code review checklist:
  - No `any` types used (unless absolutely necessary)
  - All props properly typed
  - Proper hook usage
  - Performance optimizations in place
  - Error boundaries implemented

### 6. Documentation
- [ ] Update component documentation with TypeScript examples
- [ ] Document breaking changes
- [ ] Add JSDoc comments for complex functions
- [ ] Update usage examples with TypeScript
- [ ] Document test coverage

## Best Practices
1. Refactor one component at a time
2. Write tests before refactoring (TDD approach)
3. Keep components pure when possible
4. Create custom hooks for shared logic
5. Use TypeScript strictly (avoid `any`)
6. Implement proper error boundaries
7. Consider performance optimizations
8. Maintain consistent naming conventions
9. Use proper TypeScript utility types:
   ```typescript
   type Props = Readonly<{
     value: string;
     onChange: (value: string) => void;
   }>;
   ```

## Common Gotchas
1. Remember to type event handlers properly
2. Don't forget to type async functions and their returns
3. Use proper typing for refs:
   ```typescript
   const inputRef = useRef<HTMLInputElement>(null);
   ```
4. Type your context properly:
   ```typescript
   const MyContext = React.createContext<ContextType | null>(null);
   ```

## Testing Best Practices
1. Unit Tests: Test component in isolation
2. Integration Tests: Test component interactions
3. E2E Tests: Test complete user workflows
4. Use proper TypeScript types in tests
5. Mock complex dependencies
6. Test error cases and edge cases
7. Maintain high test coverage

## Continuous Integration
- [ ] Set up TypeScript checking in CI pipeline
- [ ] Run all test suites in CI
- [ ] Check test coverage thresholds
- [ ] Lint TypeScript code
- [ ] Run E2E tests in CI environment 