# OpenAPI MCP Server

This server dynamically generates a set of [Model-Context-Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) compliant tools from an OpenAPI specification.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

## Running the Server

1.  Compile the TypeScript code:
    ```bash
    npx tsc
    ```

2.  Run the server:
    ```bash
    node dist/server.js
    ```

    The server will start on port 3000 by default.

## Configuration

-   `API_SERVER_URL`: (Optional) The base URL for the target API. If not set, the first server URL from the OpenAPI spec will be used.
-   `[SCHEME_NAME]_KEY`: API keys for authentication. The name is derived from the `securityScheme` name in the OpenAPI spec (e.g., `ApiKeyAuth` becomes `API_KEY`).

## Usage

Once the server is running, the MCP-compliant toolset can be accessed at:

```
http://localhost:3000/tools
```
