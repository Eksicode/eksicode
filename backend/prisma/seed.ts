import { PrismaClient, JobType, PostStatus } from "@prisma/client";
const prisma = new PrismaClient();
import { telegramGroupsData } from "./telegramGroupsData";
import { menuItems } from "./menuItemsData";
import { pageCategories, pages } from "./pagesData";
import { posts } from "./postsData";
import { companiesData } from "./companiesData";
import { jobsData } from "./jobsData";
import { sourcesData } from "./sourcesData";
import bcrypt from 'bcrypt';

async function cleanDatabase() {
  console.log("Cleaning database...");
  await prisma.postLike.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.source.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.tag.deleteMany({});
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
    const { id, employmentType, ...jobData } = job;
    
    const jobInput = {
      ...jobData,
      employmentType: employmentType as JobType,
      createdAt: new Date(jobData.createdAt),
      updatedAt: new Date(jobData.updatedAt),
      company: {
        connect: { id: jobData.company }
      }
    };

    await prisma.job.upsert({
      where: { id },
      update: jobInput,
      create: jobInput
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

  const hashedAdminPassword = await bcrypt.hash("eksicode2025**", 10);

  const users = [
    {
      id: 1,
      email: "admin@example.com",
      username: "admin",
      password: hashedAdminPassword,
      roleId: roles.adminRole.id,
    }
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
    ["main", "footer", "dashboard", "admin"].map(async (name) => {
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
  
  // Create post categories with fixed IDs
  const categoryData = [
    { id: 0, name: "Technology" },
    { id: 1, name: "Programming" },
    { id: 2, name: "Web Development" },
    { id: 3, name: "Data Science" }
  ];

  const categories = await Promise.all(
    categoryData.map((cat) =>
      prisma.postCategory.upsert({
        where: { id: cat.id },
        update: { name: cat.name },
        create: { id: cat.id, name: cat.name }
      })
    )
  );

  // Create tags with fixed IDs
  const tagData = [
    { id: 1, name: "javascript" },
    { id: 2, name: "react" },
    { id: 3, name: "nextjs" },
    { id: 4, name: "typescript" },
    { id: 5, name: "prisma" },
    { id: 6, name: "database" }
  ];

  const tags = await Promise.all(
    tagData.map((tag) =>
      prisma.tag.upsert({
        where: { id: tag.id },
        update: { name: tag.name },
        create: { id: tag.id, name: tag.name }
      })
    )
  );

  return { categories, tags };
}

async function seedPosts() {
  console.log("Seeding posts...");
  for (const post of posts) {
    const { status, tags, categories, ...postData } = post;
    
    const postInput = {
      ...postData,
      status: status as PostStatus,
      categories: {
        connect: categories.map(id => ({ id }))
      },
      tags: {
        connect: tags.map(id => ({ id }))
      }
    };

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: postInput,
      create: postInput
    });
  }
}

async function seedSources() {
  console.log("Seeding sources...");
  for (const source of sourcesData) {
    const { tags, ...sourceData } = source;

    await prisma.source.upsert({
      where: { id: source.id },
      update: {
        ...sourceData,
        updatedAt: new Date(),
      },
      create: {
        ...sourceData,
        createdAt: new Date(),
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
    
    await seedPostCategoriesAndTags(); // Create categories and tags first
    await seedPosts(); // Then create posts
    
    await seedTelegramGroups();
    await seedMenuCategoriesAndItems();
    await seedPageCategoriesAndPages();
    await seedCompanies();
    await seedJobs();
    await seedSources();
    
    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error; // Re-throw to see full error stack
  } finally {
    await prisma.$disconnect();
  }
}

main();
