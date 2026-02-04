'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function ProfileSettings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Profil Ayarları
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Kişisel Bilgiler
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                defaultValue={user?.username}
                className="w-full px-3 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md bg-white dark:bg-DarkerGrey text-gray-900 dark:text-white"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-posta
              </label>
              <input
                type="email"
                defaultValue={user?.email}
                className="w-full px-3 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md bg-white dark:bg-DarkerGrey text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ad
              </label>
              <input
                type="text"
                defaultValue={user?.firstName || ''}
                className="w-full px-3 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md bg-white dark:bg-DarkerGrey text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Soyad
              </label>
              <input
                type="text"
                defaultValue={user?.lastName || ''}
                className="w-full px-3 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md bg-white dark:bg-DarkerGrey text-gray-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Kaydet
            </button>
          </form>
        </div>

        {/* Account Settings */}
        <div className="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Hesap Ayarları
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">E-posta Bildirimleri</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Profili Herkese Açık</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <hr className="border-gray-200 dark:border-DarkLightGrey" />
            <Link
              href="/profile/ayarlar/sifre-degistir"
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Şifremi Değiştir
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
