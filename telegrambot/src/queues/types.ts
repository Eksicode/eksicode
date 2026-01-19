/**
 * Queue job types and interfaces
 */

export interface CommandJobData {
  type: 'command' | 'callback' | 'event';
  command: string;
  context: {
    chatId: number;
    userId: number;
    username?: string;
    messageId?: number;
    callbackQueryId?: string;
    data: any;
    chatType?: string;
  };
  priority: 'high' | 'medium' | 'low';
  retries?: number;
  timeout?: number;
}

export interface CronJobData {
  type: 'member_count' | 'source_validation' | 'cleanup';
  data: any;
  retries?: number;
  timeout?: number;
}

export type JobData = CommandJobData | CronJobData;

export interface JobResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export enum JobPriority {
  HIGH = 1,
  MEDIUM = 5,
  LOW = 10
}
