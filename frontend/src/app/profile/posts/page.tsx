'use client';

import { useAuth } from '@/hooks/useAuth';

export default function ProfilePosts() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Gönderilerim
        </h1>
        <a
          href="/posts/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Yeni Gönderi
        </a>
      </div>

      <div className="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey">
        <p className="text-gray-600 dark:text-gray-300 text-center py-8">
          Henüz gönderi bulunmuyor. İlk gönderinizi oluşturmak için "Yeni Gönderi" butonuna tıklayın.
        </p>
      </div>
    </div>
  );
}
