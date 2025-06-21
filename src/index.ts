import { MCPServer } from './mcp.server.js';
import { MCPToolContext } from './types.js'; // Added .js extension

async function main() {
  const server = new MCPServer();

  // You would typically get context from the environment or a configuration file
  // For this standalone server, we'll use a placeholder context.
  // In a real scenario, Cline would provide this context.
  const context: MCPToolContext = {
    userId: 'cline-user-id',
    companyId: 'cline-company-id',
    sessionId: 'cline-session-id',
    // Add other context properties as needed by your tool handlers
  };

  server.setContext(context);
  await server.start();
}

main().catch(error => {
  console.error('MCP Server failed to start:', error);
  process.exit(1);
});
