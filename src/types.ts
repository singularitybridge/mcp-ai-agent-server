import { z } from 'zod';

// Tool input schemas
export const SendMessageSchema = z.object({
  messageContent: z.string().describe('The message content to send'),
  attachments: z.array(z.object({
    fileId: z.string(),
    url: z.string().url(),
    mimeType: z.string(),
    fileName: z.string()
  })).optional().describe('File attachments for the message'),
  sessionId: z.string().optional().describe('Session ID (creates new session if omitted)')
});

export const ClearSessionSchema = z.object({
  // No inputs needed - uses auth context
});

export const GetAssistantsSchema = z.object({
  // No inputs needed - uses auth context
});

export const ChangeAssistantSchema = z.object({
  sessionId: z.string().describe('Session ID to update'),
  newAssistantId: z.string().describe('ID of the new assistant')
});

// Types
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
export type ClearSessionInput = z.infer<typeof ClearSessionSchema>;
export type GetAssistantsInput = z.infer<typeof GetAssistantsSchema>;
export type ChangeAssistantInput = z.infer<typeof ChangeAssistantSchema>;

// Context passed to tools
export interface MCPToolContext {
  userId: string;
  companyId: string;
  sessionId?: string; // Added sessionId
  user?: any; // IUser from your models - made optional for standalone context
  company?: any; // ICompany from your models - made optional for standalone context
}
