# Testing Setup Guide for Frontend

This guide explains how to set up testing infrastructure for the frontend project and provides comprehensive tests for the refactored SideMenu component.

## 1. Install Testing Dependencies

Add the following dependencies to your `package.json`:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

## 2. Jest Configuration

Create `jest.config.js` in the frontend root:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

## 3. Jest Setup File

Create `jest.setup.js` in the frontend root:

```javascript
import '@testing-library/jest-dom'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
```

## 4. TypeScript Configuration for Tests

Add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    // ... existing options
    "types": ["jest", "@testing-library/jest-dom"]
  },
  "include": [
    // ... existing includes
    "**/*.test.ts",
    "**/*.test.tsx"
  ]
}
```

## 5. Update Package.json Scripts

Add test scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 6. SideMenu Component Analysis

### Issues Found in Original Component:

1. **Poor Error Handling**: Used direct fetch with generic error catching
2. **No Retry Mechanism**: Single attempt, failed permanently on errors
3. **Environment Variable Issues**: `process.env.NEXT_PUBLIC_API_URL` might not be available in production
4. **Response Validation**: No validation of API response structure
5. **Inconsistent API Usage**: Other components use `getData` utility successfully

### Refactoring Improvements:

1. **Switched to getData Utility**: Uses the proven utility that handles errors gracefully
2. **Added Retry Mechanism**: 3 attempts with exponential backoff (1s, 2s, 4s)
3. **Better Error States**: User-friendly error messages with retry button
4. **Loading Improvements**: Skeleton loading with retry progress indication
5. **Response Validation**: Validates API response structure before processing
6. **Fallback Values**: Handles missing or invalid icon names gracefully
7. **Accessibility**: Proper ARIA labels and semantic HTML structure

## 7. Running Tests

After installing dependencies and setting up configuration:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 8. Production Deployment Considerations

### Environment Variables
Ensure `NEXT_PUBLIC_API_URL` is properly set in production environment.

### Error Monitoring
Consider adding error tracking (e.g., Sentry) to monitor API failures in production:

```javascript
// In the error catch block
if (process.env.NODE_ENV === 'production') {
  Sentry.captureException(error);
}
```

### Performance
The component now includes:
- Memoized callbacks to prevent unnecessary re-renders
- Proper cleanup in useEffect
- Efficient retry mechanism with exponential backoff

## 9. Testing Coverage

The test suite covers:
- ✅ Loading states and skeletons
- ✅ Successful data fetching and rendering
- ✅ Error handling and retry mechanism
- ✅ Empty state handling
- ✅ Invalid data structure handling
- ✅ Retry button functionality
- ✅ Icon fallback behavior
- ✅ Accessibility features
- ✅ Responsive design
- ✅ Integration with getData utility

This comprehensive testing approach ensures the SideMenu component is robust and handles all edge cases properly. 