'use client';

import { useAuth } from '@/hooks/useAuth';

export default function ProfileDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Profilim
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Kullanıcı Bilgileri
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Kullanıcı Adı:</span> {user?.username}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">E-posta:</span> {user?.email}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Rol:</span> {user?.roles?.join(', ')}
            </p>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Hızlı İşlemler
          </h3>
          <div className="space-y-3">
            <a
              href="/profile/posts"
              className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
            >
              Gönderilerim
            </a>
            <a
              href="/profile/ayarlar"
              className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
            >
              Profil Ayarları
            </a>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            İstatistikler
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Toplam Gönderi:</span> 0
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Toplam Beğeni:</span> 0
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Toplam Yorum:</span> 0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
