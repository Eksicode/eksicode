interface Context {
  from: { id: number };
  telegram: any;
}

async function forAdmins(ctx: Context, cb: (ctx: Context) => any): Promise<any> {
  try {
    const check = await ctx.telegram.getChatMember(
      process.env.ADMIN_CH_ID!,
      ctx.from.id
    );
    if (check && check.status !== 'kicked' && check.status !== 'left') {
      return cb(ctx);
    }
  } catch (e) {
    console.error(e);
  }
}

export default forAdmins;
export { forAdmins };
