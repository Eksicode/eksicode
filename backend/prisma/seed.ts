import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { telegramGroupsData } from "./telegramGroupsData";

async function main() {
  // Create permissions
  const createPost = await prisma.permission.create({
    data: { name: "CREATE_POST", description: "Can create posts" },
  });
  const deletePost = await prisma.permission.create({
    data: { name: "DELETE_POST", description: "Can delete posts" },
  });

  // Create roles and assign permissions
  const adminRole = await prisma.role.create({
    data: {
      name: "superadmin",
      description: "Administrator with full access",
      permissions: {
        create: [
          { permissionId: createPost.id },
          { permissionId: deletePost.id },
        ],
      },
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: "user",
      description: "Editor with limited access",
      permissions: { create: [{ permissionId: createPost.id }] },
    },
  });

  // Create users and assign roles
  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: "eksicode2025**",
      username: "admin",
      roles: { create: [{ roleId: adminRole.id }] },
    },
  });

  await prisma.user.create({
    data: {
      email: "mkltkn@gmail.com",
      password: "eksicode2025**",
      username: "mkltkn",
      roles: { create: [{ roleId: userRole.id }] },
    },
  });

  for (const group of telegramGroupsData) {
    await prisma.telegramGroup.upsert({
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
