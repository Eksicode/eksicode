import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create permissions
  const createPost = await prisma.permissions.create({ data: { name: "CREATE_POST", description: "Can create posts" } });
  const deletePost = await prisma.permissions.create({ data: { name: "DELETE_POST", description: "Can delete posts" } });

  // Create roles and assign permissions
  const adminRole = await prisma.roles.create({
    data: {
      name: "superadmin",
      description: "Administrator with full access",
      permissions: { create: [{ permissionId: createPost.id }, { permissionId: deletePost.id }] },
    },
  });

  const userRole = await prisma.roles.create({
    data: {
      name: "user",
      description: "Editor with limited access",
      permissions: { create: [{ permissionId: createPost.id }] },
    },
  });

  // Create users and assign roles
  await prisma.users.create({
    data: {
      email: "admin@example.com",
      password: "eksicode2025**",
      username: "admin",
      roles: { create: [{ roleId: adminRole.id }] },
    },
  });

  await prisma.users.create({
    data: {
      email: "mkltkn@gmail.com",
      password: "eksicode2025**",
      username: "mkltkn",
      roles: { create: [{ roleId: userRole.id }] },
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
