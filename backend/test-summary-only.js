// Simple test script to verify the summaryOnly functionality
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSummaryOnly() {
  try {
    console.log('Testing summaryOnly=true functionality...');
    
    // Test the query with the updated selectFields
    const posts = await prisma.post.findMany({
      where: {
        approved: true,
        status: "PUBLISHED",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        author: {
          select: {
            username: true,
            profilePicture: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
    });

    console.log('Query successful! Sample result:');
    console.log(JSON.stringify(posts[0], null, 2));
    console.log(`Total posts found: ${posts.length}`);
    
  } catch (error) {
    console.error('Error testing summaryOnly:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSummaryOnly();
