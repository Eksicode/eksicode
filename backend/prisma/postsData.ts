// Create 10 posts with comments, likes, tags, and categories
export const posts = [
    {
      title: "Getting Started with Web Development",
      content: "This is a comprehensive guide to web development...",
      authorIndex: 1, // Index in the users array
      tagIndices: [1, 2, 3], // Indices in the tags array
      categoryIndices: [0, 2], // Indices in the categories array
    },
    {
      title: "Understanding TypeScript",
      content: "TypeScript adds static typing to JavaScript...",
      authorIndex: 2,
      tagIndices: [3],
      categoryIndices: [1],
    },
    {
      title: "Database Design Best Practices",
      content: "Learn how to design efficient databases...",
      authorIndex: 1,
      tagIndices: [4, 5],
      categoryIndices: [1, 2],
    },
    {
      title: 'Advanced React Patterns for Scalable Applications',
      content: 'Discover advanced React patterns that help you build maintainable and scalable applications. We will cover compound components, render props, custom hooks, and more.',
      authorIndex: 2,
      tagIndices: [1, 2],
      categoryIndices: [0],
    },
    {
      title: 'Optimizing Database Queries with Prisma',
      content: 'Learn how to write efficient database queries using Prisma. Topics include relation filtering, pagination, and optimization techniques for large datasets.',
      authorIndex: 1,
      tagIndices: [4, 5],
      categoryIndices: [1],
    },
    {
      title: 'State Management in Modern React Applications',
      content: 'Explore different state management solutions in React, from useState and useContext to more complex solutions like Redux and Zustand. Learn when to use each approach.',
      authorIndex: 2,
      tagIndices: [1],
      categoryIndices: [2],
    },
    {
      title: 'Building Type-Safe APIs with TypeScript',
      content: 'Learn how to create type-safe APIs using TypeScript. We will cover request/response typing, error handling, and validation using popular libraries.',
      authorIndex: 1,
      tagIndices: [3],
      categoryIndices: [1],
    },
    {
      title: 'Implementing Authentication in Next.js Applications',
      content: 'A comprehensive guide to implementing authentication in Next.js applications. Learn about different authentication strategies and best practices.',
      authorIndex: 2,
      tagIndices: [2, 3],
      categoryIndices: [0, 2],
    },
    {
      title: 'Data Modeling with Prisma and TypeScript',
      content: 'Learn how to design efficient data models using Prisma and TypeScript. We will cover relationships, migrations, and type generation.',
      authorIndex: 1,
      tagIndices: [3, 4],
      categoryIndices: [1],
    },
    {
      title: 'Building Real-Time Features with Next.js',
      content: 'Explore how to implement real-time features in your Next.js applications using WebSockets and Server-Sent Events.',
      authorIndex: 2,
      tagIndices: [1, 2],
      categoryIndices: [2],
    },
  ];