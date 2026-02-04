import * as fs from 'fs';
import * as path from 'path';

interface Context {
  message: {
    chat: { id: number };
  };
  replyWithMarkdown: (text: string) => Promise<any>;
}

// Resolve paths relative to project root
const projectRoot = path.resolve(__dirname, '..', '..');
const helpText = fs.readFileSync(path.join(projectRoot, 'help.md'), 'utf-8');
const helpTextAdmin = fs.readFileSync(path.join(projectRoot, 'docs', 'helpAdmin.md'), 'utf-8');

function helpCommand(ctx: Context): void {
  if (ctx.message.chat.id.toString() === process.env.ADMIN_CH_ID) {
    ctx.replyWithMarkdown(helpTextAdmin);
  } else {
    ctx.replyWithMarkdown(helpText);
  }
}

export default helpCommand;
