# MCP AI Agent Server

[![npm version](https://badge.fury.io/js/%40avi%2Fmcp-ai-agent-server.svg)](https://www.npmjs.com/package/@avi/mcp-ai-agent-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An MCP server that bridges Cline to an AI agent system, allowing for seamless interaction with AI agents through the Model Context Protocol.

## Features

- 🚀 **Send Messages:** Send messages to AI agents within a session.
- 💡 **Session Management:** Clear sessions and start new ones.
- 🔧 **Assistant Management:** Get a list of available assistants and change the assistant for a session.

## Quick Start

### Install via npm (Recommended)

```bash
npm install -g @avi/mcp-ai-agent-server
```

### Install via npx (No installation required)

```bash
npx @avi/mcp-ai-agent-server
```

## Configuration

### For Cline

Add to your Cline MCP settings file:

**Location:**
- macOS: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- Windows: `%APPDATA%/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- Linux: `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

**Configuration:**
```json
{
  "mcpServers": {
    "ai-agent-mcp": {
      "command": "npx",
      "args": ["@avi/mcp-ai-agent-server"],
      "env": {
        "AI_AGENT_API_KEY": "your-api-key-here",
        "AI_AGENT_BASE_URL": "http://localhost:3000"
      }
    }
  }
}
```

## Available Tools

### `send_message`
Send a message in a session with optional attachments.

**Parameters:**
- `messageContent` (required): The message content to send.
- `attachments` (optional): An array of file attachments.

**Example:**
```
"Can you use send_message to say 'hello'?"
```

### `get_session`
Get or create a session.

**Parameters:**
- None

**Example:**
```
"Get the current session."
```

### `clear_session`
Clear the current session and start a new one.

**Parameters:**
- None

**Example:**
```
"Please clear the session."
```

### `get_assistants`
Get a list of available assistants.

**Parameters:**
- None

**Example:**
```
"List the available assistants."
```

### `change_assistant`
Change the assistant for a session.

**Parameters:**
- `sessionId` (required): The session ID to update.
- `newAssistantId` (required): The ID of the new assistant.

**Example:**
```
"Change the assistant for the current session to 'assistant-2'."
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `AI_AGENT_API_KEY` | API key for authentication | Yes | - |
| `AI_AGENT_BASE_URL` | Custom API endpoint for the AI agent system | No | `http://localhost:3000` |

## Troubleshooting

### Operation Timed Out

If you encounter an "Operation timed out" error, it means the request to the AI agent service is taking longer than the server's default internal timeout. You can resolve this by increasing the `timeout` value in your Cline MCP settings:

```json
{
  "mcpServers": {
    "ai-agent-mcp": {
      "command": "npx",
      "args": ["@avi/mcp-ai-agent-server"],
      "timeout": 300000, // 5 minutes
      "env": {
        "AI_AGENT_API_KEY": "your-api-key-here",
        "AI_AGENT_BASE_URL": "http://localhost:3000"
      }
    }
  }
}
```

## Development

### Build from source

```bash
git clone https://github.com/avi/mcp-ai-agent-server.git
cd mcp-ai-agent-server
npm install
npm run build
```

### Testing locally

```bash
# Using MCP Inspector
npx @modelcontextprotocol/inspector ./build/index.js

# Manual testing
AI_AGENT_API_KEY=test-key node ./build/index.js
```

## License

MIT - See [LICENSE](./LICENSE) for details.

## Acknowledgments

Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
