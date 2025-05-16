# React Integration Testing Guide

## Pre-requisites
- Jest and React Testing Library installed
- TypeScript types for testing libraries
- Components to be tested have been identified
- Understanding of component relationships and interactions

## Step-by-Step Integration Testing Process

### 1. Test Scope Definition
- [ ] Identify related components to test together
- [ ] Map data flows and component interactions
- [ ] Define boundaries of the integration test
- [ ] Determine which external dependencies to mock
- [ ] Create test file with naming convention `ComponentName.integration.test.tsx`

### 2. Test Environment Setup
- [ ] Import necessary testing utilities:
  ```typescript
  import { render, screen, fireEvent, waitFor } from '@testing-library/react';
  import userEvent from '@testing-library/user-event';
  import '@testing-library/jest-dom';
  ```
- [ ] Import all components under test:
  ```typescript
  import ParentComponent from './ParentComponent';
  import { APIProvider } from '../context/APIContext';
  ```
- [ ] Set up any required providers/context:
  ```typescript
  const renderWithProviders = (ui, options = {}) => {
    return render(
      <APIProvider>
        <ThemeProvider theme="light">
          {ui}
        </ThemeProvider>
      </APIProvider>,
      options
    );
  };
  ```

### 3. Test Data Setup
- [ ] Create realistic test fixtures:
  ```typescript
  const mockProducts = [
    { id: 1, name: 'Product 1', price: 10 },
    { id: 2, name: 'Product 2', price: 20 }
  ];
  ```
- [ ] Mock API responses:
  ```typescript
  jest.mock('../api/productApi', () => ({
    fetchProducts: jest.fn().mockResolvedValue(mockProducts)
  }));
  ```
- [ ] Set up mock stores/context if needed:
  ```typescript
  const mockStore = {
    cart: [],
    addToCart: jest.fn(),
    removeFromCart: jest.fn()
  };
  ```

### 4. Component Interaction Tests
- [ ] Test parent-child component interactions
- [ ] Verify data passing between components
- [ ] Test state changes across components
- [ ] Example:
  ```typescript
  test('adding product to cart updates cart count in header', async () => {
    renderWithProviders(<ShopPage />);
    
    // Find product and add to cart
    const addButtons = screen.getAllByRole('button', { name: /add to cart/i });
    userEvent.click(addButtons[0]);
    
    // Verify header cart count updated
    const cartCount = screen.getByTestId('cart-count');
    expect(cartCount).toHaveTextContent('1');
  });
  ```

### 5. Data Flow Tests
- [ ] Test data flowing up from child to parent
- [ ] Test data flowing down from parent to children
- [ ] Test sibling component interactions
- [ ] Example:
  ```typescript
  test('filter changes update product list', async () => {
    renderWithProviders(<ProductPage />);
    
    // Initially all products visible
    expect(screen.getAllByTestId('product-item')).toHaveLength(2);
    
    // Change filter
    const priceFilter = screen.getByLabelText(/price range/i);
    userEvent.click(priceFilter);
    const maxPrice = screen.getByLabelText(/maximum price/i);
    userEvent.clear(maxPrice);
    userEvent.type(maxPrice, '15');
    userEvent.click(screen.getByRole('button', { name: /apply/i }));
    
    // Only one product should be visible now
    expect(screen.getAllByTestId('product-item')).toHaveLength(1);
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
  });
  ```

### 6. Context and State Management Tests
- [ ] Test components with shared context
- [ ] Test Redux/Zustand/Jotai/Recoil state changes
- [ ] Test effects of context changes on multiple components
- [ ] Example:
  ```typescript
  test('theme change affects all themed components', () => {
    renderWithProviders(<AppLayout />);
    
    // Initial theme
    const header = screen.getByTestId('header');
    const sidebar = screen.getByTestId('sidebar');
    
    expect(header).toHaveClass('light-theme');
    expect(sidebar).toHaveClass('light-theme');
    
    // Change theme
    const themeToggle = screen.getByLabelText(/dark mode/i);
    userEvent.click(themeToggle);
    
    // All components should update
    expect(header).toHaveClass('dark-theme');
    expect(sidebar).toHaveClass('dark-theme');
  });
  ```

### 7. Form Integration Tests
- [ ] Test multi-step forms
- [ ] Test form submissions and API interactions
- [ ] Test form validation across components
- [ ] Example:
  ```typescript
  test('checkout process completes successfully', async () => {
    renderWithProviders(<CheckoutPage />);
    
    // Step 1: Shipping info
    userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    userEvent.type(screen.getByLabelText(/address/i), '123 Test St');
    userEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 2: Payment info
    await screen.findByText(/payment information/i);
    userEvent.type(screen.getByLabelText(/card number/i), '4242424242424242');
    userEvent.type(screen.getByLabelText(/expiration/i), '12/25');
    userEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 3: Review and submit
    await screen.findByText(/review your order/i);
    userEvent.click(screen.getByRole('button', { name: /place order/i }));
    
    // Order confirmation
    await screen.findByText(/thank you for your order/i);
    expect(screen.getByText(/order number/i)).toBeInTheDocument();
  });
  ```

### 8. Routing Integration Tests
- [ ] Test navigation between routes
- [ ] Test route parameters and state preservation
- [ ] Test protected routes and authentication
- [ ] Example:
  ```typescript
  test('navigating preserves cart state', async () => {
    renderWithProviders(<App />);
    
    // Add item to cart on product page
    userEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    
    // Navigate to another page
    userEvent.click(screen.getByRole('link', { name: /about/i }));
    await screen.findByText(/about us/i);
    
    // Navigate back to shop
    userEvent.click(screen.getByRole('link', { name: /shop/i }));
    await screen.findByText(/products/i);
    
    // Cart should still have item
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
  });
  ```

### 9. Error Handling Tests
- [ ] Test error propagation between components
- [ ] Test error boundaries
- [ ] Test global error handling
- [ ] Example:
  ```typescript
  test('API error shows error message in multiple components', async () => {
    // Mock API failure
    jest.spyOn(console, 'error').mockImplementation(() => {});
    productApi.fetchProducts.mockRejectedValueOnce(new Error('API Error'));
    
    renderWithProviders(<ProductPage />);
    
    // Loading state should show first
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Error state should appear
    await screen.findByText(/could not load products/i);
    
    // Error should be shown in multiple places
    expect(screen.getByTestId('product-list-error')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-error')).toBeInTheDocument();
    
    console.error.mockRestore();
  });
  ```

## Best Practices
1. Focus on component interactions, not individual component details
2. Test realistic user scenarios and workflows
3. Use the minimal set of components necessary for the test
4. Mock external dependencies that aren't part of the integration test
5. Test both success and error paths
6. Use data-testid attributes for integration test selectors
7. Avoid testing implementation details
8. Keep tests independent and reset state between tests

## Common Integration Testing Patterns
1. **Parent-Child Testing**: Testing how data flows between parent and child components
2. **Context Provider Testing**: Testing components that share a common context
3. **Form Flow Testing**: Testing multi-step forms and wizards
4. **Route Transition Testing**: Testing navigation between different routes
5. **Container/Presentation Testing**: Testing container components with their presentational children
6. **Feature Testing**: Testing all components involved in a specific feature
7. **Error Boundary Testing**: Testing how errors propagate and are handled

## Integration vs. Unit vs. E2E Testing
- **Unit Tests**: Test a single component in isolation
- **Integration Tests**: Test multiple components working together
- **E2E Tests**: Test the entire application from the user's perspective

Unit tests are more focused and faster, but don't catch integration issues.
E2E tests are comprehensive but slow and more brittle.
Integration tests hit the sweet spot for many scenarios:
- Faster than E2E tests
- More realistic than unit tests
- Good coverage of component interactions
- Can catch many bugs before E2E tests

## Troubleshooting Common Issues
1. **Tests interfering with each other**: Ensure proper cleanup between tests
2. **Mocking issues**: Verify mock implementations and reset mocks between tests
3. **Async timing problems**: Use waitFor and findBy queries for async operations
4. **Context/Provider problems**: Check that all required providers are included in tests
5. **Too many re-renders**: Look for state update loops or improper prop handling 