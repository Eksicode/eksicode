// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { telegramGroupsData } from './telegramGroupsData';

async function main() {

  for (const group of telegramGroupsData) {
    await prisma.telegramGroups.upsert({
      where: { id: group.id },
      update: {},
      create: {
        id: group.id,
        name: group.name,
        icon: group.logo,
        members: group.members,
        link: group.link,
        channelId: group.channel_id,
        listOrder: group.list_order,
        description: group.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });