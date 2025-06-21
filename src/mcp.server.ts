import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { McpError, ErrorCode, ServerResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { 
  MCPToolContext,
  SendMessageSchema,
  ClearSessionSchema,
  GetAssistantsSchema,
  ChangeAssistantSchema 
} from './types.js'; // Added .js extension

import * as sessionToolHandlers from './tools/session.tools.js'; // Added .js extension
import * as assistantToolHandlers from './tools/assistant.tools.js'; // Added .js extension

export class MCPServer {
  private server: McpServer;
  private context: MCPToolContext | null = null;

  constructor() {
    this.server = new McpServer(
      {
        name: 'ai-agent-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );
    this.registerTools();
  }

  private registerTools() {
    this.server.registerTool(
      'send_message',
      {
        description: 'Send a message in a session with optional attachments',
        inputSchema: SendMessageSchema.shape // Pass the raw Zod shape
      },
      async (args: z.infer<typeof SendMessageSchema>, extra: any): Promise<ServerResult> => {
        if (!this.context) throw new Error('MCP context not set for send_message');
        const result = await sessionToolHandlers.handleSendMessage(this.context, args);
        return result;
      }
    );

    this.server.registerTool(
      'clear_session',
      {
        description: 'Clear the current session and start a new one',
        inputSchema: ClearSessionSchema.shape
      },
      async (args: z.infer<typeof ClearSessionSchema>, extra: any): Promise<ServerResult> => {
        if (!this.context) throw new Error('MCP context not set for clear_session');
        const result = await sessionToolHandlers.handleClearSession(this.context, args);
        return result;
      }
    );

    this.server.registerTool(
      'get_assistants',
      {
        description: 'Get list of available assistants',
        inputSchema: GetAssistantsSchema.shape
      },
      async (args: z.infer<typeof GetAssistantsSchema>, extra: any): Promise<ServerResult> => {
        if (!this.context) throw new Error('MCP context not set for get_assistants');
        const result = await assistantToolHandlers.handleGetAssistants(this.context, args);
        return result;
      }
    );

    this.server.registerTool(
      'change_assistant',
      {
        description: 'Change the assistant for a session',
        inputSchema: ChangeAssistantSchema.shape
      },
      async (args: z.infer<typeof ChangeAssistantSchema>, extra: any): Promise<ServerResult> => {
        if (!this.context) throw new Error('MCP context not set for change_assistant');
        const result = await assistantToolHandlers.handleChangeAssistant(this.context, args);
        return result;
      }
    );
  }

  setContext(context: MCPToolContext) {
    this.context = context;
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP Server started and connected via STDIO.'); // Log to stderr for debugging
  }
}
