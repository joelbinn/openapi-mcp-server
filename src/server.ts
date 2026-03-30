// src/server.ts
import express from 'express';
import { ToolFactory } from './factory/ToolFactory';
import { McpAdapter } from './adapter/McpAdapter';

(async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        const toolFactory = new ToolFactory();
        const tools = await toolFactory.createFromFile('./openapi.yaml');
        console.log('Internal tools loaded successfully.');

        const mcpAdapter = new McpAdapter();
        const mcpTools = mcpAdapter.transform(tools);
        console.log('MCP tools transformed successfully.');

        app.get('/', (req, res) => {
            res.send('MCP Server is running!');
        });

        app.get('/tools', (req, res) => {
            res.json(mcpTools);
        });

        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
})();
