export type MessageRole = "user" | "assistant" | "tool";

export type MessageStatus = "pending" | "streaming" | "completed" | "error";

export type ToolResultStatus = "loading" | "success" | "empty" | "error";

export interface ToolCall {
  title: string;
  status: ToolResultStatus;
  description?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  /** Assistant messages use this to drive the renderer. */
  status?: MessageStatus;
  /** Tool messages carry a ToolCall payload. */
  tool?: ToolCall | null;
}
