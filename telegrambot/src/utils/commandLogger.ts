/**
 * Command logging utilities
 */

import * as fs from 'fs';
import * as path from 'path';

interface LogEntry {
  timestamp: string;
  userId: number;
  username: string;
  chatId: number;
  chatType: string;
  command: string;
  success: boolean;
  error: string | null;
  messageId: number;
}

interface CommandStats {
  totalCommands: number;
  successfulCommands: number;
  failedCommands: number;
  successRate: number;
}

interface Context {
  from: { id: number; username?: string; first_name?: string };
  chat: { id: number; type: string };
  message: { message_id: number };
}

class CommandLogger {
  private logDir: string;

  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Log command usage
   */
  logCommand(ctx: Context, command: string, success: boolean = true, error: Error | null = null): void {
    // Handle callback queries which don't have ctx.message
    if (!ctx.message) {
      console.log(`[COMMAND] ${command} - ${success ? 'SUCCESS' : 'FAILED'}`);
      return;
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      userId: ctx.from.id,
      username: ctx.from.username || ctx.from.first_name || 'Unknown',
      chatId: ctx.chat.id,
      chatType: ctx.chat.type,
      command: command,
      success: success,
      error: error ? error.message : null,
      messageId: ctx.message.message_id
    };

    // Log to console
    console.log(`[COMMAND] ${command} by ${logEntry.username} (${logEntry.userId}) - ${success ? 'SUCCESS' : 'FAILED'}`);
    
    // Log to file
    this.writeToFile('commands.log', JSON.stringify(logEntry) + '\n');
  }

  /**
   * Log error
   */
  logError(ctx: Context, command: string, error: Error): void {
    this.logCommand(ctx, command, false, error);
    this.writeToFile('errors.log', `${new Date().toISOString()} - ${command} - ${error.message}\n`);
  }

  /**
   * Write to log file
   */
  writeToFile(filename: string, data: string): void {
    const filePath = path.join(this.logDir, filename);
    fs.appendFileSync(filePath, data);
  }

  /**
   * Get command statistics
   */
  getStats(): CommandStats {
    try {
      const commandsFile = path.join(this.logDir, 'commands.log');
      if (!fs.existsSync(commandsFile)) {
        return { 
          totalCommands: 0, 
          successfulCommands: 0,
          failedCommands: 0,
          successRate: 0 
        };
      }

      const logs: LogEntry[] = fs.readFileSync(commandsFile, 'utf8')
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));

      const totalCommands = logs.length;
      const successfulCommands = logs.filter(log => log.success).length;
      const successRate = totalCommands > 0 ? (successfulCommands / totalCommands) * 100 : 0;

      return {
        totalCommands,
        successfulCommands,
        failedCommands: totalCommands - successfulCommands,
        successRate: Math.round(successRate * 100) / 100
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return { 
        totalCommands: 0, 
        successfulCommands: 0,
        failedCommands: 0,
        successRate: 0 
      };
    }
  }
}

const commandLoggerInstance = new CommandLogger();

export default commandLoggerInstance;
export { CommandLogger };
export const commandLogger = commandLoggerInstance;

// CommonJS compatibility for direct requires from JS files
module.exports = commandLoggerInstance;
module.exports.CommandLogger = CommandLogger;
module.exports.commandLogger = commandLoggerInstance;
