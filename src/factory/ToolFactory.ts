// src/factory/ToolFactory.ts

import SwaggerParser from "swagger-parser";
import axios, { AxiosInstance, AxiosError } from "axios";

export interface InternalTool {
    id: string;
    summary: string;
    operation: any; // The original OpenAPI operation object
    execute: (args: any) => Promise<any>;
}

export class ToolFactory {

    private _configureHttpClient(serverUrl: string, api: any): AxiosInstance { // Changed api type to any
        const client = axios.create({
            baseURL: serverUrl,
        });

        const securitySchemes = api.components?.securitySchemes;
        // Check if api.security is an array or if securitySchemes exists
        if (!api.security || api.security.length === 0 || !securitySchemes) {
            return client;
        }

        for (const requirement of api.security) {
            for (const schemeName in requirement) {
                const scheme = securitySchemes[schemeName];
                // Ensure scheme is of type SecuritySchemeObject and has expected properties
                if (scheme && typeof scheme === 'object' && 'type' in scheme && scheme.type === 'apiKey' && 'in' in scheme && scheme.in === 'header' && 'name' in scheme) {
                    const envVarName = `${schemeName.replace(/Auth$/, '').toUpperCase()}_KEY`;
                    const apiKey = process.env[envVarName];

                    if (apiKey) {
                        console.log(`Configuring API Key auth: Header '${scheme.name}' from env '${envVarName}'.`);
                        client.interceptors.request.use(config => {
                            config.headers[scheme.name] = apiKey;
                            return config;
                        });
                    } else {
                        console.warn(`WARN: Security scheme '${schemeName}' requires an API key in env var '${envVarName}', but it was not found.`);
                    }
                }
            }
        }

        return client;
    }

    private _createExecuteFn(operation: any, path: string, method: string, httpClient: AxiosInstance): (args: any) => Promise<any> {
        return async (args: any) => {
            let finalPath = path;
            const queryParams: { [key: string]: any } = {};
            const headers: { [key: string]: any } = {};
            let body: any = null;

            if (operation.parameters) {
                for (const param of operation.parameters) {
                    const argValue = args[param.name];
                    if (argValue === undefined) continue;

                    switch (param.in) {
                        case 'path':
                            finalPath = finalPath.replace(`{${param.name}}`, encodeURIComponent(argValue));
                            break;
                        case 'query':
                            queryParams[param.name] = argValue;
                            break;
                        case 'header':
                            headers[param.name] = argValue;
                            break;
                    }
                }
            }

            if (operation.requestBody) {
                body = args;
            }

            try {
                const response = await httpClient.request({
                    method,
                    url: finalPath,
                    params: queryParams,
                    headers,
                    data: body,
                });
                return response.data;
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    console.error(`Error executing tool '${operation.operationId}':`, error.response?.data || error.message);
                } else {
                    console.error(`Error executing tool '${operation.operationId}':`, error);
                }
                throw error;
            }
        };
    }

    public async createFromFile(filePath: string): Promise<{ [key: string]: InternalTool }> {
        try {
            const api: any = await (SwaggerParser as any).validate(filePath); // Cast SwaggerParser to any
            
            let serverUrl: string | undefined = process.env.API_SERVER_URL;
            if (!serverUrl) {
                if (api.servers && api.servers.length > 0) {
                    serverUrl = api.servers[0].url;
                } else {
                    throw new Error("No API server URL provided in environment variables or in the OpenAPI spec.");
                }
            }

            const httpClient = this._configureHttpClient(serverUrl!, api);
            const tools: { [key: string]: InternalTool } = {};

            for (const path in api.paths) {
                for (const method in api.paths[path]) {
                    const operation = api.paths[path][method];
                    if (operation.operationId) {
                        const tool: InternalTool = {
                            id: operation.operationId,
                            summary: operation.summary || '',
                            operation: operation,
                            execute: this._createExecuteFn(operation, path, method, httpClient)
                        };
                        tools[operation.operationId] = tool;
                    }
                }
            }

            return tools;
        } catch (err: unknown) {
            console.error(`Error validating OpenAPI spec at ${filePath}:`, err);
            throw err;
        }
    }
}
