// src/adapter/McpAdapter.ts

import { InternalTool } from "../factory/ToolFactory";

export class McpAdapter {
    public transform(tools: { [key: string]: InternalTool }): any[] {
        const mcpTools: any[] = [];
        for (const tool of Object.values(tools)) {

            const properties: { [key: string]: any } = {};
            const required: string[] = [];

            if (tool.operation.parameters) {
                for (const param of tool.operation.parameters) {
                    properties[param.name] = {
                        type: param.schema.type, // Basic mapping
                        description: param.description,
                    };
                    if (param.required) {
                        required.push(param.name);
                    }
                }
            }
            
            if (tool.operation.requestBody) {
                const requestBodySchema = tool.operation.requestBody.content['application/json']?.schema;
                if (requestBodySchema && requestBodySchema.properties) {
                    for (const propName in requestBodySchema.properties) {
                        properties[propName] = {
                            type: requestBodySchema.properties[propName].type,
                            description: requestBodySchema.properties[propName].description,
                        };
                    }
                    if (requestBodySchema.required) {
                        required.push(...requestBodySchema.required);
                    }
                }
            }

            const mcpTool = {
                type: 'function',
                function: {
                    name: tool.id,
                    description: tool.summary,
                    parameters: {
                        type: 'object',
                        properties,
                        required,
                    }
                }
            };
            mcpTools.push(mcpTool);
        }
        return mcpTools;
    }
}
