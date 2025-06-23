#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ServerResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

// Import tool handlers and schemas from types.ts
import * as sessionToolHandlers from './tools/session.tools.js';
import * as assistantToolHandlers from './tools/assistant.tools.js';
import { MCPToolContext } from './types.js';
import {
  SendMessageSchema,
  ClearSessionSchema,
  GetAssistantsSchema,
  ChangeAssistantSchema,
  GetSessionSchema
} from './types.js';

const server = new McpServer({
  name: "ai-agent-mcp",
  version: packageJson.version
});

// Configuration
const config = {
  apiKey: process.env.AI_AGENT_API_KEY,
  apiBaseUrl: process.env.AI_AGENT_BASE_URL || "http://localhost:3000",
  maxRetries: 3,
  timeout: 300000
};

// Utility for structured error responses
function createErrorResponse(error: unknown, context?: any): ServerResult {
  const errorDetails = {
    error: error instanceof Error ? error.message : String(error),
    code: error instanceof Error && 'code' in error ? (error as any).code : 'UNKNOWN_ERROR',
    timestamp: new Date().toISOString(),
    context
  };
  console.error("Tool error:", errorDetails);
  return {
    content: [{
      type: "text",
      text: JSON.stringify(errorDetails, null, 2)
    }],
    isError: true
  };
}

// Utility for retrying operations
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = config.maxRetries
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;

      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries exceeded");
}

// Timeout wrapper for all operations
async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number = config.timeout
): Promise<T> {
  if (timeoutMs <= 0) {
    return operation;
  }
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)
  );

  return Promise.race([operation, timeout]);
}

// Tool: Send a message
server.tool(
  'send_message',
  SendMessageSchema.shape,
  async (args: z.infer<typeof SendMessageSchema>, extra: any): Promise<ServerResult> => {
    try {
      const context: MCPToolContext = {
        userId: extra.userId || 'default-user-id',
        companyId: extra.companyId || 'default-company-id',
        sessionId: extra.sessionId,
        user: extra.user,
        company: extra.company,
      };
      const operation = withRetry(() => sessionToolHandlers.handleSendMessage(context, args));
      const result = await withTimeout(operation);
      return result;
    } catch (error) {
      return createErrorResponse(error, { tool: 'send_message', args });
    }
  }
);

// Tool: Clear session
server.tool(
  'clear_session',
  ClearSessionSchema.shape,
  async (args: z.infer<typeof ClearSessionSchema>, extra: any): Promise<ServerResult> => {
    try {
      const context: MCPToolContext = {
        userId: extra.userId || 'default-user-id',
        companyId: extra.companyId || 'default-company-id',
        sessionId: extra.sessionId,
        user: extra.user,
        company: extra.company,
      };
      const operation = withRetry(() => sessionToolHandlers.handleClearSession(context, args));
      const result = await withTimeout(operation);
      return result;
    } catch (error) {
      return createErrorResponse(error, { tool: 'clear_session', args });
    }
  }
);

// Tool: Get assistants
server.tool(
  'get_assistants',
  GetAssistantsSchema.shape,
  async (args: z.infer<typeof GetAssistantsSchema>, extra: any): Promise<ServerResult> => {
    try {
      const context: MCPToolContext = {
        userId: extra.userId || 'default-user-id',
        companyId: extra.companyId || 'default-company-id',
        sessionId: extra.sessionId,
        user: extra.user,
        company: extra.company,
      };
      const operation = withRetry(() => assistantToolHandlers.handleGetAssistants(context, args));
      const result = await withTimeout(operation);
      return result;
    } catch (error) {
      return createErrorResponse(error, { tool: 'get_assistants', args });
    }
  }
);

// Tool: Get session
server.tool(
  'get_session',
  GetSessionSchema.shape,
  async (args: z.infer<typeof GetSessionSchema>, extra: any): Promise<ServerResult> => {
    try {
      const context: MCPToolContext = {
        userId: extra.userId || 'default-user-id',
        companyId: extra.companyId || 'default-company-id',
        sessionId: extra.sessionId,
        user: extra.user,
        company: extra.company,
      };
      const operation = withRetry(() => sessionToolHandlers.handleGetSession(context, args));
      const result = await withTimeout(operation);
      return result;
    } catch (error) {
      return createErrorResponse(error, { tool: 'get_session', args });
    }
  }
);

// Tool: Change assistant
server.tool(
  'change_assistant',
  ChangeAssistantSchema.shape,
  async (args: z.infer<typeof ChangeAssistantSchema>, extra: any): Promise<ServerResult> => {
    try {
      const context: MCPToolContext = {
        userId: extra.userId || 'default-user-id',
        companyId: extra.companyId || 'default-company-id',
        sessionId: extra.sessionId,
        user: extra.user,
        company: extra.company,
      };
      const operation = withRetry(() => assistantToolHandlers.handleChangeAssistant(context, args));
      const result = await withTimeout(operation);
      return result;
    } catch (error) {
      return createErrorResponse(error, { tool: 'change_assistant', args });
    }
  }
);

// Register a health check resource
server.resource(
  "health",
  "health://server",
  async () => {
    try {
      const health = {
        status: "healthy",
        version: "1.0.0",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
      };
      return {
        contents: [{
          uri: "health://server",
          text: JSON.stringify(health, null, 2)
        }]
      };
    } catch (error) {
      return {
        contents: [{
          uri: "health://server",
          text: `Error fetching health: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// Main startup function
async function main() {
  // Environment variable validation
  if (!config.apiKey) {
    console.error(`
❌ Error: AI_AGENT_API_KEY environment variable is required

To fix this:
1. Get your API key from your AI agent system.
2. Add it to your MCP configuration:
   "env": {
     "AI_AGENT_API_KEY": "your-key-here"
   }
`);
    process.exit(1);
  }
  if (!config.apiBaseUrl) {
    console.error("Error: AI_AGENT_BASE_URL environment variable is required");
    process.exit(1);
  }

  const transport = new StdioServerTransport();

  transport.onerror = (error) => {
    console.error("Transport error:", error);
  };

  await server.connect(transport);
  console.error("AI Agent Bridge MCP Server running on stdio.");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
