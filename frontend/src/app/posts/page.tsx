import React from 'react';
import { redirect } from 'next/navigation'

function Posts() {
  redirect('/')
  return (
    <div>
      <h1>Posts</h1>
    </div>
  );
}

export default Posts;