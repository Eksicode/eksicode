import * as fs from 'fs';

interface Context {
  message: {
    chat: { id: number };
  };
  replyWithMarkdown: (text: string) => Promise<any>;
}

const helpText = fs.readFileSync('help.md', 'utf-8');
const helpTextAdmin = fs.readFileSync('helpAdmin.md', 'utf-8');

function helpCommand(ctx: Context): void {
  if (ctx.message.chat.id.toString() === process.env.ADMIN_CH_ID) {
    ctx.replyWithMarkdown(helpTextAdmin);
  } else {
    ctx.replyWithMarkdown(helpText);
  }
}

export default helpCommand;
