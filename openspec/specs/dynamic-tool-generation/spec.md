## ADDED Requirements

### Requirement: Parse OpenAPI 3.x Specification
The system SHALL parse a valid OpenAPI 3.x specification file at startup.

#### Scenario: Valid Specification
- **WHEN** the server is started with a path to a valid OpenAPI 3.x YAML or JSON file
- **THEN** the system successfully parses the file without errors and proceeds with tool generation.

#### Scenario: Invalid Specification
- **WHEN** the server is started with a file that is not a valid OpenAPI 3.x specification
- **THEN** the system SHALL fail to start and log a descriptive error message.

### Requirement: Configure API Server URL
The system SHALL determine the target API server URL based on configuration.

#### Scenario: Environment Variable is Present
- **WHEN** the server is started and the `API_SERVER_URL` environment variable is set
- **THEN** the system SHALL use the value of `API_SERVER_URL` as the base URL for all API calls.

#### Scenario: Environment Variable is Absent
- **WHEN** the server is started, the `API_SERVER_URL` environment variable is NOT set, and the OpenAPI spec contains a `servers` array
- **THEN** the system SHALL use the `url` from the first entry in the `servers` array as the base URL.

### Requirement: Configure API Authentication
The system SHALL configure authentication for API calls based on the OpenAPI specification and environment variables.

#### Scenario: API Key Authentication
- **WHEN** the OpenAPI spec defines a `securityScheme` of type `apiKey` in a `header` named `X-API-Key` and a corresponding environment variable (e.g., `API_KEY`) is set
- **THEN** all API calls made by the generated tools SHALL include the `X-API-Key` header with the value from the environment variable.

### Requirement: Generate Executable Tools
The system SHALL generate a collection of in-memory, executable tools corresponding to the operations defined in the OpenAPI specification.

#### Scenario: Tool Collection Generation
- **WHEN** the system successfully parses an OpenAPI specification
- **THEN** it SHALL create a collection of tool objects, where each tool is keyed by the `operationId` from the corresponding API operation.
- **AND** each tool object SHALL contain an `execute` function.

### Requirement: Execute Tools with Correct Parameter Mapping
The generated `execute` function for a tool SHALL correctly map its arguments to the corresponding HTTP request.

#### Scenario: Tool Execution with Path, Query, and Header Parameters
- **WHEN** a tool is executed with an arguments object, e.g., `tool.getUser({ userId: '123', status: 'active', 'X-Request-ID': 'xyz' })`
- **AND** the OpenAPI operation specifies that `userId` is a `path` parameter, `status` is a `query` parameter, and `X-Request-ID` is a `header` parameter
- **THEN** the resulting HTTP request SHALL be `GET /users/123?status=active`
- **AND** the request SHALL contain the header `X-Request-ID: xyz`.
