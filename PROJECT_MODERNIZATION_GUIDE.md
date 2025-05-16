# React Project Modernization Guide

This guide outlines the process of modernizing an existing React project to React 19 with TypeScript, import aliases, and modern project structure. Follow these steps in order before beginning component-level refactoring.

## Pre-requisites
- Existing React project to modernize
- Node.js v18+ and npm/yarn/pnpm installed
- Administrator access to the project repository

## Step-by-Step Modernization Process

### 1. Project Analysis

- [ ] Create a backup of your project
- [ ] Identify current React version
- [ ] Document current build system (webpack, Create React App, etc.)
- [ ] List primary dependencies
- [ ] Document current project structure:
  ```bash
  find src -type f -name "*.js" | sort > project_structure.txt
  ```
- [ ] Identify entry point (typically index.js)
- [ ] Document key components and their relationships

### 2. Dependency Updates

- [ ] Update React and ReactDOM to version 19:
  ```bash
  npm install react@latest react-dom@latest
  # or
  yarn add react@latest react-dom@latest
  # or
  pnpm add react@latest react-dom@latest
  ```
- [ ] Install TypeScript and type definitions:
  ```bash
  npm install -D typescript @types/react @types/react-dom @types/node
  # or
  yarn add -D typescript @types/react @types/react-dom @types/node
  # or
  pnpm add -D typescript @types/react @types/react-dom @types/node
  ```
- [ ] Update test libraries:
  ```bash
  npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
  # or
  yarn add -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
  # or
  pnpm add -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
  ```
- [ ] Install E2E testing framework:
  ```bash
  npm install -D cypress
  # or
  yarn add -D cypress
  # or
  pnpm add -D cypress
  ```
- [ ] Update other dependencies as needed

### 3. TypeScript Configuration

- [ ] Create a basic tsconfig.json in the project root:
  ```json
  {
    "compilerOptions": {
      "target": "es5",
      "lib": ["dom", "dom.iterable", "esnext"],
      "allowJs": true,
      "skipLibCheck": true,
      "esModuleInterop": true,
      "allowSyntheticDefaultImports": true,
      "strict": true,
      "forceConsistentCasingInFileNames": true,
      "noFallthroughCasesInSwitch": true,
      "module": "esnext",
      "moduleResolution": "node",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "jsx": "react-jsx",
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"],
        "@components/*": ["src/components/*"],
        "@utils/*": ["src/utils/*"],
        "@hooks/*": ["src/hooks/*"],
        "@styles/*": ["src/styles/*"],
        "@assets/*": ["src/assets/*"],
        "@context/*": ["src/context/*"],
        "@types/*": ["src/types/*"]
      }
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "build", "dist", "cypress"]
  }
  ```
- [ ] Adjust the paths configuration based on your project structure
- [ ] Create a global type definitions file:
  ```typescript
  // src/types/global.d.ts
  declare module '*.svg' {
    import React = require('react');
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
  }

  declare module '*.png' {
    const content: string;
    export default content;
  }

  declare module '*.jpg' {
    const content: string;
    export default content;
  }

  declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
  }
  ```
- [ ] Create an empty src/types/index.ts file for shared types

### 4. Build System Configuration

#### For Create React App:
- [ ] Check if you need to eject:
  ```bash
  npm run eject
  # or 
  yarn eject
  # or
  pnpm eject
  ```
- [ ] Alternatively, use CRACO for customization without ejecting
  ```bash
  npm install -D @craco/craco
  # or
  yarn add -D @craco/craco
  # or
  pnpm add -D @craco/craco
  ```
- [ ] Create a craco.config.js file:
  ```javascript
  const path = require('path');

  module.exports = {
    webpack: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@context': path.resolve(__dirname, 'src/context'),
        '@types': path.resolve(__dirname, 'src/types'),
      },
    },
  };
  ```
- [ ] Update package.json scripts to use craco:
  ```json
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test"
  }
  ```

#### For custom webpack:
- [ ] Update webpack.config.js with alias support:
  ```javascript
  // Add to your webpack config
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@types': path.resolve(__dirname, 'src/types'),
    }
  }
  ```
- [ ] Add TypeScript loader:
  ```javascript
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      }
      // other loaders...
    ]
  }
  ```

### 5. Project Structure Modernization

- [ ] Create/organize directory structure:
  ```
  src/
  ├── assets/           # Static files like images, fonts
  ├── components/       # Shared components
  │   └── UI/           # Generic UI components
  ├── context/          # React context definitions
  ├── hooks/            # Custom React hooks
  ├── pages/            # Page components
  ├── styles/           # Global styles, themes, variables
  ├── types/            # TypeScript type definitions
  ├── utils/            # Helper functions
  ├── App.tsx           # Main App component
  └── index.tsx         # Entry point
  ```
- [ ] Move files into the new structure
- [ ] Create placeholder files for new directories if needed

### 6. Entry Point Modernization

- [ ] Rename index.js to index.tsx
- [ ] Update to React 19 API:
  ```typescript
  import React from 'react';
  import { createRoot } from 'react-dom/client';
  import App from './App';
  import './index.css';

  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Failed to find the root element');

  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  ```
- [ ] Update any imports to use aliases if applicable

### 7. Testing Setup

- [ ] Create Jest configuration:
  ```javascript
  // jest.config.js
  module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^@components/(.*)$': '<rootDir>/src/components/$1',
      '^@utils/(.*)$': '<rootDir>/src/utils/$1',
      '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
      '^@styles/(.*)$': '<rootDir>/src/styles/$1',
      '^@assets/(.*)$': '<rootDir>/src/assets/$1',
      '^@context/(.*)$': '<rootDir>/src/context/$1',
      '^@types/(.*)$': '<rootDir>/src/types/$1',
      '\\.(css|less|scss)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  };
  ```
- [ ] Create jest setup file:
  ```typescript
  // src/setupTests.ts
  import '@testing-library/jest-dom';
  ```
- [ ] Create Cypress configuration:
  ```typescript
  // cypress.config.ts
  import { defineConfig } from 'cypress';

  export default defineConfig({
    e2e: {
      baseUrl: 'http://localhost:3000',
      setupNodeEvents(on, config) {
        // implement node event listeners here
      },
    },
    component: {
      devServer: {
        framework: 'react',
        bundler: 'webpack',
      },
    },
  });
  ```
- [ ] Create Cypress support files:
  ```typescript
  // cypress/support/e2e.ts
  import './commands';
  ```
  ```typescript
  // cypress/support/commands.ts
  /// <reference types="cypress" />

  // Add custom commands here...
  ```
- [ ] Add test scripts to package.json:
  ```json
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "test:e2e": "start-server-and-test start http://localhost:3000 cypress:run"
  }
  ```

### 8. Converting the First Component

- [ ] Start with a simple component
- [ ] Create TypeScript interface for props
- [ ] Convert to functional component
- [ ] Update imports to use aliases
- [ ] Example conversion:

#### Before (App.js):
```jsx
import React, { Component } from 'react';
import Header from './components/Header';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Header title="My React App" />
        <main>Content goes here</main>
      </div>
    );
  }
}

export default App;
```

#### After (App.tsx):
```tsx
import React from 'react';
import Header from '@components/Header';
import '@styles/App.css';

interface AppProps {
  // Define props if any
}

const App: React.FC<AppProps> = () => {
  return (
    <div className="app">
      <Header title="My React App" />
      <main>Content goes here</main>
    </div>
  );
};

export default App;
```

### 9. Validation

- [ ] Build the project:
  ```bash
  npm run build
  # or
  yarn build
  # or
  pnpm build
  ```
- [ ] Run tests:
  ```bash
  npm test
  # or
  yarn test
  # or
  pnpm test
  ```
- [ ] Start development server:
  ```bash
  npm start
  # or
  yarn start
  # or
  pnpm start
  ```
- [ ] Check for TypeScript errors
- [ ] Verify import aliases are working
- [ ] Ensure React 19 features are working properly

### 10. Preparing for Component-by-Component Refactoring

- [ ] Identify components to refactor
- [ ] Prioritize components (start with leaf components)
- [ ] Create a tracking spreadsheet or task list
- [ ] For each component:
  1. Create tests using UNIT_TESTING_RULES.md
  2. Refactor using REFACTORING_RULES.md
  3. Validate with tests
  4. Document changes
  5. Move to next component

## Common Issues and Solutions

### TypeScript Cannot Find Module
- Check path aliases in tsconfig.json
- Verify webpack/CRACO configuration
- Ensure moduleNameMapper in jest.config.js matches tsconfig paths

### React 19 Rendering Errors
- Ensure createRoot API is used correctly
- Check for deprecated lifecycle methods
- Verify event handlers are not using deprecated patterns

### Import Alias Not Working
- Check for typos in import paths
- Verify build tool configuration matches tsconfig.json
- Restart development server
- Clear build cache

### Test Failures
- Update tests to match new component structure
- Add proper TypeScript types to test files
- Update mocks and fixtures

## Additional Resources
- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Module Path Aliases in TypeScript](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [React Testing Best Practices](https://testing-library.com/docs/react-testing-library/intro/) 