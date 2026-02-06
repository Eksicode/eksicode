'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import postService from '@/services/postService';
import { PostCard } from '@/components/PostCard';
import { IPost } from '@/types/types';
import Link from 'next/link';

export default function ProfilePosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await postService.getUserPosts(Number(user.id));

        if (response.success && response.data) {
          setPosts(response.data);
        } else {
          setError(response.message || 'Gönderiler alınamadı');
        }
      } catch (err) {
        console.error('Error fetching user posts:', err);
        setError('Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserPosts();
    }
  }, [user?.id]);

  // If user is not yet available but we expect it, we could show loading.
  // But let's just stick to the previous logic which was simple.

  if (loading && !posts.length && user?.id) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Gönderilerim
          </h1>
        </div>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Gönderilerim
        </h1>
        <Link
          href="/profile/posts/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Yeni Gönderi
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div key={post.id} className="w-full relative">
              <PostCard post={post} />
              <div className="absolute top-4 right-4">
                <Link
                  href={`/profile/posts/${post.slug}/edit`}
                  className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
                >
                  Düzenle
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey text-center">
          <p className="text-gray-600 dark:text-gray-300 py-8">
            Henüz gönderi bulunmuyor. İlk gönderinizi oluşturmak için "Yeni Gönderi" butonuna tıklayın.
          </p>
        </div>
      )}
    </div>
  );
}
