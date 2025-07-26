'use client';

import { useAuth } from '@/hooks/useAuth';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Admin Panel
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <div className="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Toplam Kullanıcı
          </h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>

        <div className="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Toplam Gönderi
          </h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>

        <div className="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Bekleyen Onay
          </h3>
          <p className="text-3xl font-bold text-yellow-600">0</p>
        </div>

        <div className="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Toplam Yorum
          </h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
        </div>
      </div>

      {/* Admin Quick Actions */}
      <div className="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Hızlı İşlemler
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/kullanicilar"
            className="block p-4 border border-gray-200 dark:border-DarkLightGrey rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <h4 className="font-medium text-gray-900 dark:text-white">Kullanıcı Yönetimi</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Kullanıcıları görüntüle ve yönet</p>
          </a>
          
          <a
            href="/admin/posts"
            className="block p-4 border border-gray-200 dark:border-DarkLightGrey rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <h4 className="font-medium text-gray-900 dark:text-white">Gönderi Yönetimi</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Gönderileri onayla ve yönet</p>
          </a>
          
          <a
            href="/admin/ayarlar"
            className="block p-4 border border-gray-200 dark:border-DarkLightGrey rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <h4 className="font-medium text-gray-900 dark:text-white">Sistem Ayarları</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Genel ayarları düzenle</p>
          </a>
        </div>
      </div>

      {/* Current User Info */}
      <div className="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Admin Bilgileri
        </h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Kullanıcı:</span> {user?.username}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Rol:</span> {user?.roles?.join(', ')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Yetkiler:</span> {user?.permissions?.length || 0} yetki
          </p>
        </div>
      </div>
    </div>
  );
}
