import { z } from 'zod';
import { ServerResult } from '@modelcontextprotocol/sdk/types.js'; // Import ServerResult
import { 
  MCPToolContext,
  GetAssistantsInput,
  ChangeAssistantInput
} from '../types.js'; // Added .js extension
// These imports will cause issues as they are relative to the original project.
// For now, we'll comment them out to allow compilation.
// import { getAssistants } from '../../services/assistant/assistant-management.service';
// import { updateSessionAssistant } from '../../services/session.service';

export async function handleGetAssistants(context: MCPToolContext, args: GetAssistantsInput): Promise<ServerResult> {
  try {
    const apiKey = process.env.AI_AGENT_API_KEY;
    const baseUrl = process.env.AI_AGENT_BASE_URL;

    if (!apiKey || !baseUrl) {
      throw new Error('AI_AGENT_API_KEY and AI_AGENT_BASE_URL must be set in the environment variables.');
    }

    const response = await fetch(`${baseUrl}/assistant`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const assistants = await response.json();
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(assistants, null, 2)
        }
      ]
    } as ServerResult;
  } catch (error: any) {
    console.error(`Error in handleGetAssistants: ${error.message}`);
    return {
      content: [
        {
          type: 'text',
          text: `Failed to get assistants: ${error.message || 'Unknown error'}`
        }
      ]
    } as ServerResult;
  }
}

export async function handleChangeAssistant(context: MCPToolContext, args: ChangeAssistantInput): Promise<ServerResult> {
  try {
    const apiKey = process.env.AI_AGENT_API_KEY;
    const baseUrl = process.env.AI_AGENT_BASE_URL;

    if (!apiKey || !baseUrl) {
      throw new Error('AI_AGENT_API_KEY and AI_AGENT_BASE_URL must be set in the environment variables.');
    }

    if (!args.sessionId) {
      throw new Error('sessionId is required.');
    }

    const response = await fetch(`${baseUrl}/session/${args.sessionId}/assistant`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ assistantId: args.newAssistantId }),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const updatedSession = await response.json();
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(updatedSession, null, 2)
        }
      ]
    } as ServerResult;
  } catch (error: any) {
    console.error(`Error in handleChangeAssistant: ${error.message}`);
    return {
      content: [
        {
          type: 'text',
          text: `Failed to change assistant: ${error.message || 'Unknown error'}`
        }
      ]
    } as ServerResult;
  }
}
