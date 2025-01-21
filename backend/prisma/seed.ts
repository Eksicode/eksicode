import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { telegramGroupsData } from "./telegramGroupsData";
import { menuItems } from "./menuItemsData";
import { pageCategories, pages } from "./pagesData";
import { posts } from "./postsData";

async function cleanDatabase() {
  console.log("Cleaning database...");
  await prisma.postLike.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.hashTag.deleteMany({});
  await prisma.postCategory.deleteMany({});
  await prisma.menu.deleteMany({});
  await prisma.menuCategory.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.permission.deleteMany({});
}

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
        set: [],
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
        set: [],
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

  const users = [
    {
      email: "admin@example.com",
      username: "admin",
      password: "eksicode2025**",
      roleId: roles.adminRole.id,
    },
    {
      email: "mkltkn@gmail.com",
      username: "mkltkn",
      password: "eksicode2025**",
      roleId: roles.userRole.id,
    },
    {
      email: "john@example.com",
      username: "John Doe",
      password: "defaultpassword",
      profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    {
      email: "jane@example.com",
      username: "Jane Smith",
      password: "defaultpassword",
      profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    },
  ];

  for (const user of users) {
    const { roleId, ...userData } = user;
    await prisma.user.upsert({
      where: { email: user.email },
      update: { 
        username: user.username,
        ...(roleId && {
          roles: {
            set: [],  // Clear existing roles
            create: [{ roleId }]
          }
        })
      },
      create: {
        ...userData,
        roles: roleId ? {
          create: [{ roleId }]
        } : undefined
      },
    });
  }
}

async function seedTelegramGroups() {
  console.log("Seeding telegram groups...");
  for (const group of telegramGroupsData) {
    const { channel_id, list_order, logo, ...groupData } = group;
    await prisma.telegramGroup.upsert({
      where: { name: group.name },
      update: {},
      create: {
        ...groupData,
        channelId: channel_id,
        listOrder: list_order,
        icon: logo,
      },
    });
  }
}

async function seedMenuCategoriesAndItems() {
  console.log("Seeding menu categories and items...");
  
  // Create a map to store category name -> id mapping
  const categoryMap = new Map();
  
  // Create categories and store their IDs
  const categories = await Promise.all(
    ["main-menu", "footer-menu"].map(async (name) => {
      const category = await prisma.menuCategory.upsert({
        where: { name },
        create: { name },
        update: {}
      });
      categoryMap.set(name, category.id);
      return category;
    })
  );

  for (const menuItem of menuItems) {
    const { categories: categoryNames, id, ...menuItemData } = menuItem;
    
    // Get category IDs from the map
    const categoryIds = categoryNames.map(name => categoryMap.get(String(name)))
                                   .filter(id => id !== undefined);
    
    await prisma.menu.upsert({
      where: { id: id || -1 },
      update: menuItemData,
      create: {
        ...menuItemData,
        categories: {
          connect: categoryIds.map(categoryId => ({ id: categoryId }))
        }
      }
    });
  }
}

async function seedPageCategoriesAndPages() {
  console.log("Seeding page categories and pages...");
  for (const category of pageCategories) {
    await prisma.pageCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  for (const page of pages) {
    const { categories, ...pageData } = page;
    await prisma.page.upsert({
      where: { slug: pageData.slug },
      update: pageData,
      create: { ...pageData, categories: { connect: categories.map((name) => ({ name })) } },
    });
  }
}

async function seedPostCategoriesAndTags() {
  console.log("Seeding post categories and tags...");
  const categories = await Promise.all(
    ["Technology", "Programming", "Web Development", "Data Science"].map((name) =>
      prisma.postCategory.create({ data: { name } })
    )
  );

  const tags = await Promise.all(
    ["javascript", "react", "nextjs", "typescript", "prisma", "database"].map((name) =>
      prisma.hashTag.create({ data: { name } })
    )
  );

  return { categories, tags };
}

async function seedPosts(users, categories, tags) {
  console.log("Seeding posts...");

  for (const post of posts) {
    const { authorIndex, tagIndices, categoryIndices, ...postData } = post;
    
    await prisma.post.create({
      data: {
        ...postData,
        slug: post.title.toLowerCase().replace(/ /g, "-"),
        author: {
          connect: { id: users[authorIndex].id }
        },
        categories: {
          connect: categoryIndices.map(index => ({ id: categories[index].id }))
        },
        tags: {
          connect: tagIndices.map(index => ({ id: tags[index].id }))
        }
      },
    });
  }
}

async function main() {
  try {
    await cleanDatabase();

    const permissions = await seedPermissions();
    const roles = await seedRoles(permissions);
    await seedUsers(roles);
    await seedTelegramGroups();
    await seedMenuCategoriesAndItems();
    await seedPageCategoriesAndPages();

    const { categories, tags } = await seedPostCategoriesAndTags();
    const users = await prisma.user.findMany();
    await seedPosts(users, categories, tags);

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
