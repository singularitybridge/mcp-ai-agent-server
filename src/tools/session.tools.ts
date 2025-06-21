import { z } from 'zod';
import { ServerResult } from '@modelcontextprotocol/sdk/types.js'; // Import ServerResult
import { 
  MCPToolContext,
  SendMessageInput,
  ClearSessionInput,
  GetSessionInput
} from '../types.js'; // Added .js extension
// These imports will cause issues as they are relative to the original project.
// For now, we'll comment them out to allow compilation.
// import { getSessionOrCreate, getCurrentSession, endSession } from '../../services/session.service';
// import { handleSessionMessage } from '../../services/assistant/message-handling.service';
// import { getApiKey } from '../../services/api.key.service';
// import { ChannelType } from '../../types/ChannelType';

export async function handleSendMessage(context: MCPToolContext, args: SendMessageInput): Promise<ServerResult> {
  try {
    const apiKey = process.env.AI_AGENT_API_KEY;
    const baseUrl = process.env.AI_AGENT_BASE_URL;

    if (!apiKey || !baseUrl) {
      throw new Error('AI_AGENT_API_KEY and AI_AGENT_BASE_URL must be set in the environment variables.');
    }

    const response = await fetch(`${baseUrl}/assistant/user-input`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ userInput: args.messageContent, sessionId: context.sessionId }),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const responseData = await response.json();
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(responseData, null, 2)
        }
      ]
    } as ServerResult;
  } catch (error: any) {
    console.error(`Error in handleSendMessage: ${error.message}`);
    return {
      content: [
        {
          type: 'text',
          text: `Failed to send message: ${error.message || 'Unknown error'}`
        }
      ]
    } as ServerResult;
  }
}

export async function handleGetSession(context: MCPToolContext, args: GetSessionInput): Promise<ServerResult> {
  try {
    const apiKey = process.env.AI_AGENT_API_KEY;
    const baseUrl = process.env.AI_AGENT_BASE_URL;

    if (!apiKey || !baseUrl) {
      throw new Error('AI_AGENT_API_KEY and AI_AGENT_BASE_URL must be set in the environment variables.');
    }

    const response = await fetch(`${baseUrl}/session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const session = await response.json();
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(session, null, 2)
        }
      ]
    } as ServerResult;
  } catch (error: any) {
    console.error(`Error in handleGetSession: ${error.message}`);
    return {
      content: [
        {
          type: 'text',
          text: `Failed to get session: ${error.message || 'Unknown error'}`
        }
      ]
    } as ServerResult;
  }
}

export async function handleClearSession(context: MCPToolContext, args: ClearSessionInput): Promise<ServerResult> {
  try {
    const apiKey = process.env.AI_AGENT_API_KEY;
    const baseUrl = process.env.AI_AGENT_BASE_URL;

    if (!apiKey || !baseUrl) {
      throw new Error('AI_AGENT_API_KEY and AI_AGENT_BASE_URL must be set in the environment variables.');
    }

    const response = await fetch(`${baseUrl}/session/clear`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const newSession = await response.json();
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(newSession, null, 2)
        }
      ]
    } as ServerResult;
  } catch (error: any) {
    console.error(`Error in handleClearSession: ${error.message}`);
    return {
      content: [
        {
          type: 'text',
          text: `Failed to clear session: ${error.message || 'Unknown error'}`
        }
      ]
    } as ServerResult;
  }
}
