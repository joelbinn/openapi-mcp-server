# AGENTS.md - Developer Guidelines for openapi-mcp-server

## Overview
This is a new TypeScript/Node.js project for an OpenAPI MCP Server. The codebase follows functional programming principles with immutability and pure functions where possible.

---

## Build, Lint, and Test Commands

### Package Manager
This project uses **npm** as the package manager.

### Core Commands
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the development server
npm run dev

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run all tests
npm test

# Run a single test file
npm test -- path/to/file.test.ts

# Run tests matching a pattern
npm test -- --grep "test name"

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Additional Commands
```bash
# Format code
npm run format

# Clean build artifacts
npm run clean
```

---

## Code Style Guidelines

### TypeScript Configuration
- Use strict TypeScript mode (`"strict": true` in tsconfig.json)
- Enable `noImplicitAny`, `strictNullChecks`, `strictPropertyInitialization`
- Use ES2022+ target and module settings

### Formatting
- **Indentation**: 2 spaces (no tabs)
- **Line length**: Maximum 100 characters
- **Trailing commas**: Use trailing commas in multi-line objects/arrays
- **Quotes**: Use single quotes for strings, double quotes for JSX
- **Semicolons**: Always use semicolons
- **File endings**: End files with a newline

### Naming Conventions
| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `openapi-client.ts` |
| Classes | PascalCase | `OpenApiClient` |
| Interfaces | PascalCase (prefix with I optional) | `IUserService` or `UserService` |
| Types | PascalCase | `ApiResponse` |
| Enums | PascalCase (members UPPER_CASE) | `HttpMethod.GET` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Functions | camelCase | `parseOpenApiSpec` |
| Variables | camelCase | `isLoading` |
| Boolean variables | Prefix with `is`, `has`, `should` | `isValid`, `hasPermission` |
| Async functions | Suffix with `Async` | `fetchSpecAsync` |

### Imports
- **Organize imports** in the following order:
  1. Node built-ins (fs, path, etc.)
  2. External libraries (express, zod, etc.)
  3. Internal modules (relative imports)
  4. Type imports
- **Use path aliases** configured in tsconfig.json (`@/`, `#/` etc.)
- **Avoid barrel imports** (index.ts re-exports) unless necessary
- **Use explicit named imports** over default imports

Example:
```typescript
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { z } from 'zod';
import express from 'express';

import type { OpenApiSpec } from '@/types/openapi';
import { parseSchema } from '@/utils/schema-parser';
```

### Type Definitions
- Use `type` for unions, intersections, and type aliases
- Use `interface` for object shapes that may be extended
- Always define return types for functions (especially public APIs)
- Use `readonly` for immutable arrays and objects
- Avoid `any`, use `unknown` when type is truly unknown

```typescript
// Good
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
interface User {
  readonly id: string;
  readonly name: string;
}

// Avoid
interface User {
  id: string;
  name: string;
}
```

### Error Handling
- Use custom error classes that extend `Error`
- Include error codes and context in errors
- Never expose sensitive information in error messages
- Use Result types or Either patterns for operations that can fail

```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Usage
function fetchData(): Promise<Result<Data, ApiError>> {
  // ...
}
```

### Functional Programming Principles
- Prefer pure functions over methods with side effects
- Use immutable data structures (spread operators, `Object.freeze`)
- Use array methods (`map`, `filter`, `reduce`) over for-loops
- Use Option/Result patterns instead of null/undefined checks where appropriate
- Keep functions small and focused (single responsibility)

```typescript
// Good - pure function
function calculateTotal(items: readonly CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Avoid - mutating input
function addItem(items: CartItem[], item: CartItem): void {
  items.push(item);
}

// Use spread for immutability
function addItem(items: readonly CartItem[], item: CartItem): CartItem[] {
  return [...items, item];
}
```

### Async/Await and Promises
- Use `async`/`await` over raw Promises
- Always handle errors with try/catch for async functions
- Use `Promise.all` for parallel operations, `Promise.allSettled` when partial failure is acceptable

### Testing Guidelines
- Follow Arrange-Act-Assert (AAA) pattern
- Use descriptive test names: `should_[expected]_when_[condition]`
- Test one thing per test
- Use `describe` blocks to group related tests
- Mock external dependencies (HTTP calls, file system, etc.)
- Keep test files co-located with source files (`*.test.ts` or `*.spec.ts`)

```typescript
describe('parseOpenApiSpec', () => {
  describe('when given a valid OpenAPI 3.0 spec', () => {
    it('should return a parsed spec object', () => {
      // Arrange
      const spec = createValidSpec();

      // Act
      const result = parseOpenApiSpec(spec);

      // Assert
      expect(result.isOk()).toBe(true);
    });
  });
});
```

### Logging
- Use a structured logger (pino, winston)
- Include correlation IDs for request tracking
- Never log sensitive data (passwords, tokens, PII)
- Use appropriate log levels: error, warn, info, debug

---

## Project Structure

```
openapi-mcp-server/
├── src/
│   ├── domain/           # Core business logic, entities, value objects
│   ├── application/      # Use cases, application services
│   ├── infrastructure/   # External adapters, repositories, controllers
│   ├── config/           # Configuration and DI
│   └── index.ts          # Entry point
├── tests/                # Test files (co-located with src)
├── openspec/             # OpenSpec change management
├── package.json
├── tsconfig.json
└── package-lock.json
```

---

## Important Notes

1. **No existing code**: This is a new project. Build from scratch following the conventions above.
2. **Hexagonal Architecture**: Keep business logic in domain layer, external dependencies in infrastructure.
3. **Dependency Injection**: Use constructor injection for services.
4. **Environment Variables**: Use `.env` files, never commit secrets.
5. **Git Workflow**: Use feature branches, conventional commits, and pull requests.

---

## Quick Reference

| Task | Command |
|------|---------|
| Run dev server | `npm run dev` |
| Run tests | `npm test` |
| Run single test | `npm test -- path/to/test.test.ts` |
| Type check | `npm run typecheck` |
| Lint | `npm run lint` |
| Build | `npm run build` |