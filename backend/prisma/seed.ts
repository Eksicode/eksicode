import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { telegramGroupsData } from "./telegramGroupsData";
import { menuItems } from "./menuItemsData";

async function seedPermissions() {
  console.log("Seeding permissions...");
  const createPost = await prisma.permission.create({
    data: { name: "CREATE_POST", description: "Can create posts" },
  });

  const deletePost = await prisma.permission.create({
    data: { name: "DELETE_POST", description: "Can delete posts" },
  });

  return { createPost, deletePost };
}

async function seedRoles(permissions) {
  console.log("Seeding roles...");

  const adminRole = await prisma.role.upsert({
    where: { name: "superadmin" },
    update: {
      description: "Administrator with full access",
      permissions: {
        set: [], // Clear existing permissions
        create: [
          { permissionId: permissions.createPost.id },
          { permissionId: permissions.deletePost.id },
        ],
      },
    },
    create: {
      name: "superadmin",
      description: "Administrator with full access",
      permissions: {
        create: [
          { permissionId: permissions.createPost.id },
          { permissionId: permissions.deletePost.id },
        ],
      },
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "user" },
    update: {
      description: "Editor with limited access",
      permissions: {
        set: [], // Clear existing permissions
        create: [{ permissionId: permissions.createPost.id }],
      },
    },
    create: {
      name: "user",
      description: "Editor with limited access",
      permissions: {
        create: [{ permissionId: permissions.createPost.id }],
      },
    },
  });

  return { adminRole, userRole };
}

async function seedUsers(roles) {
  console.log("Seeding users...");

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      username: "admin",
      roles: {
        set: [], // Clear existing roles
        create: [{ roleId: roles.adminRole.id }],
      },
    },
    create: {
      email: "admin@example.com",
      password: "eksicode2025**",
      username: "admin",
      roles: {
        create: [{ roleId: roles.adminRole.id }],
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "mkltkn@gmail.com" },
    update: {
      username: "mkltkn",
      roles: {
        set: [], // Clear existing roles
        create: [{ roleId: roles.userRole.id }],
      },
    },
    create: {
      email: "mkltkn@gmail.com",
      password: "eksicode2025**",
      username: "mkltkn",
      roles: {
        create: [{ roleId: roles.userRole.id }],
      },
    },
  });

  console.log("Users seeded successfully.");
}

async function seedTelegramGroups() {
  console.log("Seeding telegram groups...");
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

async function seedMenuCategories() {
  console.log("Seeding menu categories...");

  const mainMenuCategory = await prisma.menuCategory.create({
    data: {
      name: "main-menu",
    },
  });

  const footerMenuCategory = await prisma.menuCategory.create({
    data: {
      name: "footer-menu",
    },
  });

  return { mainMenuCategory, footerMenuCategory };
}

async function seedMenus(menuCategory) {
  console.log("Seeding menus...");
  for (const menuItem of menuItems) {
    const { categories, ...menuItemData } = menuItem;
    
    await prisma.menu.create({
      data: {
        ...menuItemData,
        categories: {
          connect: [{ id: menuCategory.id }]
        },
      },
    });
  }
}

async function main() {
  try {
    console.log("Deleting existing data...");
    // Delete in correct order to respect foreign keys
    await prisma.menu.deleteMany({});
    await prisma.menuCategory.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.permission.deleteMany({});

    const permissions = await seedPermissions();
    const roles = await seedRoles(permissions);
    await seedUsers(roles);
    await seedTelegramGroups();

    const { footerMenuCategory, mainMenuCategory } = await seedMenuCategories();
    await seedMenus(mainMenuCategory);
    await seedMenus(footerMenuCategory);

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
