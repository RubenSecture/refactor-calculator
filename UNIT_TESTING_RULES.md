# React Component Unit Testing Guide with React Testing Library

## Pre-requisites
- Jest and React Testing Library installed
- TypeScript types for testing libraries
- Component to be tested has been identified

## Step-by-Step Unit Testing Process

### 1. Test File Setup
- [ ] Create test file with naming convention `ComponentName.test.tsx`
- [ ] Import required testing libraries:
  ```typescript
  import { render, screen, fireEvent, waitFor } from '@testing-library/react';
  import userEvent from '@testing-library/user-event';
  import '@testing-library/jest-dom';
  import ComponentName from './ComponentName';
  ```
- [ ] Set up test suite with `describe` block
- [ ] Add any mocks or test data before tests

### 2. Component Rendering Tests
- [ ] Test basic rendering without props
- [ ] Test rendering with default props
- [ ] Test rendering with all possible props
- [ ] Verify all required UI elements are present
- [ ] Example:
  ```typescript
  test('renders calculator button with correct text', () => {
    render(<Button name="7" clickHandler={() => {}} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });
  ```

### 3. Props Tests
- [ ] Test optional props are handled correctly
- [ ] Test prop type validations (if applicable)
- [ ] Test conditional rendering based on props
- [ ] Test prop callbacks are received correctly
- [ ] Example:
  ```typescript
  test('applies orange class when orange prop is true', () => {
    render(<Button name="+" orange clickHandler={() => {}} />);
    const button = screen.getByText('+').closest('.component-button');
    expect(button).toHaveClass('orange');
  });
  ```

### 4. Event Handler Tests
- [ ] Test click events
- [ ] Test change events (for inputs)
- [ ] Test form submissions
- [ ] Test keyboard events
- [ ] Test focus/blur events if applicable
- [ ] Example:
  ```typescript
  test('calls clickHandler with button name when clicked', () => {
    const mockClickHandler = jest.fn();
    render(<Button name="8" clickHandler={mockClickHandler} />);
    
    fireEvent.click(screen.getByText('8'));
    expect(mockClickHandler).toHaveBeenCalledWith('8');
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });
  ```

### 5. State Change Tests
- [ ] Test initial state
- [ ] Test state changes from user interactions
- [ ] Test state changes from prop changes
- [ ] Test state persistence
- [ ] Example:
  ```typescript
  test('toggles open state when clicked', () => {
    render(<Dropdown options={['Option 1', 'Option 2']} />);
    const dropdown = screen.getByRole('button');
    
    // Initial state: closed
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    
    // Click to open
    userEvent.click(dropdown);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    // Click to close
    userEvent.click(dropdown);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
  ```

### 6. Asynchronous Tests
- [ ] Test loading states
- [ ] Test data fetching
- [ ] Test transitions and animations
- [ ] Test promises and async functions
- [ ] Example:
  ```typescript
  test('displays data after loading', async () => {
    render(<DataFetcher url="/api/data" />);
    
    // Initial loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for data
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Data is displayed
    expect(screen.getByText('Data Item 1')).toBeInTheDocument();
  });
  ```

### 7. Edge Case Tests
- [ ] Test empty states
- [ ] Test error states
- [ ] Test boundary values
- [ ] Test accessibility concerns
- [ ] Example:
  ```typescript
  test('displays error message when API fails', async () => {
    server.use(
      rest.get('/api/data', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    render(<DataFetcher url="/api/data" />);
    
    await waitFor(() => {
      expect(screen.getByText('Error loading data')).toBeInTheDocument();
    });
  });
  ```

### 8. Snapshot Tests (Optional)
- [ ] Create snapshots for stable components
- [ ] Update snapshots when design changes
- [ ] Verify snapshot diffs are expected
- [ ] Example:
  ```typescript
  test('matches snapshot', () => {
    const { container } = render(<Button name="7" clickHandler={() => {}} />);
    expect(container).toMatchSnapshot();
  });
  ```

## Best Practices
1. Use semantic queries (getByRole, getByLabelText) over non-semantic ones (getByTestId)
2. Prefer userEvent over fireEvent for more realistic browser simulation
3. Test component behavior, not implementation details
4. Mock external dependencies and services
5. Use test-data attributes only when semantic queries won't work
6. Ensure tests are independent of each other
7. Clean up after each test with `afterEach`
8. Write tests that closely resemble how users interact with components

## RTL Query Priority
Always use queries in this order of preference:
1. `getByRole` - Most accessible and preferred
2. `getByLabelText` - Good for form fields
3. `getByPlaceholderText` - For input fields
4. `getByText` - Good for buttons and content
5. `getByDisplayValue` - For form input current values
6. `getByAltText` - For images
7. `getByTitle` - For title attributes
8. `getByTestId` - Last resort

## Command Cheatsheet
- **Finding Elements**:
  - `getBy*`: Returns the matching node, throws error if not found or multiple found
  - `queryBy*`: Returns the matching node, returns null if not found, throws if multiple found
  - `findBy*`: Returns a promise which resolves when element is found, rejects if not found or multiple found
  - `getAllBy*`: Returns an array of all matching nodes, throws if none found
  - `queryAllBy*`: Returns an array of all matching nodes, returns empty array if none found
  - `findAllBy*`: Returns a promise which resolves to an array of elements, rejects if no elements found

- **Assertions**:
  - `toBeInTheDocument()`: Element exists in document
  - `toHaveTextContent()`: Element has specified text
  - `toBeVisible()`: Element is visible
  - `toBeDisabled()`: Element is disabled
  - `toHaveClass()`: Element has specified class
  - `toHaveAttribute()`: Element has specified attribute
  - `toHaveValue()`: Form element has specified value
  - `toBeChecked()`: Checkbox is checked
  - `toBeEmpty()`: Element has no content 