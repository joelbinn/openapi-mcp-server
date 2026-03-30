## 1. Project Setup

- [x] 1.1 Initialize a new NodeJS project (`npm init`).
- [x] 1.2 Add TypeScript as a dev dependency (`npm install --save-dev typescript @types/node`).
- [x] 1.3 Create a `tsconfig.json` file with strict settings.
- [x] 1.4 Add an HTTP client library (`npm install axios`).
- [x] 1.5 Add an OpenAPI parser library (`npm install swagger-parser`).
- [x] 1.6 Add an HTTP server framework (`npm install express && npm install --save-dev @types/express`).
- [x] 1.7 Create the initial directory structure (`src`, `src/factory`, `src/adapter`, `src/server.ts`).

## 2. Core Factory and Parsing

- [x] 2.1 Create the `ToolFactory` class structure in `src/factory/ToolFactory.ts`.
- [x] 2.2 Implement the `createFromFile` method that takes a file path.
- [x] 2.3 Inside `createFromFile`, use `swagger-parser` to parse and validate the OpenAPI spec file.
- [x] 2.4 Add error handling for invalid specification files.

## 3. HTTP Client Configuration

- [x] 3.1 Implement the logic to read the `API_SERVER_URL` environment variable.
- [x] 3.2 Implement the fallback logic to read the first `url` from the `servers` array in the spec if the environment variable is not set.
- [x] 3.3 Create a private method in `ToolFactory` to configure and instantiate an `axios` client with the correct base URL.
- [x] 3.4 Extend the HTTP client configuration to handle `securitySchemes` for API Key authentication, reading the key from a conventional environment variable.

## 4. Tool Generation Logic

- [x] 4.1 Implement the main loop within `ToolFactory` that iterates over `paths` and `methods` in the parsed spec.
- [x] 4.2 For each operation, create an *internal* `tool` object with metadata (`id`, `summary`, etc.) and an `execute` function.
- [x] 4.3 Implement the dynamic generation of the `execute` function for each tool.
- [x] 4.4 Inside the `execute` function, implement the parameter mapping logic to correctly place arguments into the request's path, query, and headers.
- [x] 4.5 Ensure the `execute` function uses the configured HTTP client to make the actual API call.
- [x] 4.6 Store the generated internal tools in a collection keyed by their `operationId`.

## 5. MCP Adapter and Presentation

- [x] 5.1 Create the `McpAdapter` class in `src/adapter/McpAdapter.ts`.
- [x] 5.2 Implement a `transform` method in `McpAdapter` that takes the collection of internal tools.
- [x] 5.3 Inside `transform`, map the internal tool structure to the official MCP `tool` JSON schema. This will involve creating the `function` declaration structure with `name`, `description`, and `parameters`.
- [x] 5.4 Ensure the parameter mapping correctly translates OpenAPI schema types to JSON schema types for the MCP tool definition.

## 6. Server Integration

- [x] 6.1 In `src/server.ts`, set up a basic Express application.
- [x] 6.2 Create an instance of the `ToolFactory` and call `createFromFile` to get the internal tool collection.
- [x] 6.3 Create an instance of `McpAdapter` and use it to transform the internal tools into the MCP-compliant format.
- [x] 6.4 Create a `/tools` GET endpoint that returns the MCP-compliant JSON toolset.
- [x] 6.5 Add a `README.md` to the project explaining how to install dependencies and run the server.

## 7. Build Project

- [x] 7.1 Compile the TypeScript code with `npx tsc`.
