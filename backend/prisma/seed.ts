import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { telegramGroupsData } from "./telegramGroupsData";
import { menuItems } from "./menuItemsData";
import { pageCategories, pages } from "./pagesData";
import { posts } from "./postsData";
import { companiesData } from "./companiesData";
import { jobsData } from "./jobsData";
import { sourcesData } from "./sourcesData";

async function cleanDatabase() {
  console.log("Cleaning database...");
  await prisma.postLike.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.source.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.hashTag.deleteMany({});
  await prisma.postCategory.deleteMany({});
  await prisma.menu.deleteMany({});
  await prisma.menuCategory.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.source.deleteMany({});
}

async function seedCompanies() {
  console.log("Seeding companies...");

  for (const company of companiesData) {
    const { id, ...companyData } = company;
    await prisma.company.upsert({
      where: { id: id },
      update: {},
      create: {
        ...companyData,
      },
    });
  }
}

async function seedJobs() {
  console.log("Seeding jobs...");

  for (const job of jobsData) {
    const { id, ...jobData } = job;

    await prisma.job.upsert({
      where: { id: job.id }, // Assuming job has an id
      update: {
        ...jobData,
        createdAt: new Date(jobData.createdAt),
        updatedAt: new Date(jobData.updatedAt),
        company: {
          connect: { id: jobData.company }
        }
      },
      create: {
        ...jobData,
        createdAt: new Date(jobData.createdAt),
        updatedAt: new Date(jobData.updatedAt),
        company: {
          connect: { id: jobData.company }
        }
      },
    });
  }
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
  
  const categoryMap = new Map();
  
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

async function seedPosts() {
  console.log("Seeding posts...");
  for (const post of posts) {
    const postData = post;

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...postData,
        categories: {
          connect: postData.categories.map((id: number) => ({ id }))
        },
        tags: {
          connect: postData.tags.map((id: number) => ({ id }))
        }
      },
    });
  }
}

async function seedSources() {
  console.log("Seeding sources...");

  for (const source of sourcesData) {
    const { id, ...sourceData } = source;
    await prisma.source.upsert({
      where: { id: id },
      update: {
      },
      create: {
        ...sourceData,
        hashtags: {
          connectOrCreate: sourceData.hashtags.map((name: string) => ({
            where: { name },
            create: { name },
          })),
        },
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
    const { categories, tags } = await seedPostCategoriesAndTags();
    await prisma.user.findMany();
    await seedPosts();
    await seedTelegramGroups();
    await seedMenuCategoriesAndItems();
    await seedPageCategoriesAndPages();
    await seedCompanies();
    await seedJobs();
    await seedSources();
    
    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
