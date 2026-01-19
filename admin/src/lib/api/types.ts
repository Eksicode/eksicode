export interface User {
	id: string;
	username: string;
	email: string;
	firstName?: string;
	lastName?: string;
	roles: string[];
	permissions: string[];
	profilePicture?: string;
	verified?: boolean;
}

export interface Role {
	id: string;
	name: string;
	description?: string;
	permissions: string[];
	isSystemRole?: boolean;
	userCount?: number;
	createdAt: string;
	updatedAt: string;
}

export interface TelegramGroup {
	id: string;
	name: string;
	icon?: string;
	members: number;
	link: string;
	channelId?: string;
	listOrder?: number;
	description?: string;
	active: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface BaseResponse<T, M = any> {
	data: T[];
	meta: M;
	message: string;
}

export type UserRole = 'user' | 'admin' | 'superadmin' | 'moderator';

export const ROLES = {
	USER: 'user',
	ADMIN: 'admin',
	SUPERADMIN: 'superadmin',
	MODERATOR: 'moderator'
} as const;

// Permission categories for better organization
export interface PermissionCategory {
	name: string;
	label: string;
	permissions: Permission[];
}

export interface Permission {
	key: string;
	label: string;
	description?: string;
}

export const PERMISSION_CATEGORIES: PermissionCategory[] = [
	{
		name: 'users',
		label: 'Kullanıcı Yönetimi',
		permissions: [
			{ key: 'user.read', label: 'Kullanıcıları Görüntüle', description: 'Kullanıcı listesini görüntüleme' },
			{ key: 'user.write', label: 'Kullanıcı Oluştur/Düzenle', description: 'Kullanıcı ekleme ve güncelleme' },
			{ key: 'user.delete', label: 'Kullanıcı Sil', description: 'Kullanıcı silme' },
			{ key: 'user.manage_roles', label: 'Rol Ata', description: 'Kullanıcılara rol atama' }
		]
	},
	{
		name: 'posts',
		label: 'Gönderi Yönetimi',
		permissions: [
			{ key: 'post.read', label: 'Gönderileri Görüntüle', description: 'Gönderi listesini görüntüleme' },
			{ key: 'post.write', label: 'Gönderi Oluştur/Düzenle', description: 'Gönderi ekleme ve güncelleme' },
			{ key: 'post.delete', label: 'Gönderi Sil', description: 'Gönderi silme' },
			{ key: 'post.approve', label: 'Gönderi Onayla', description: 'Gönderi onaylama ve moderasyon' }
		]
	},
	{
		name: 'comments',
		label: 'Yorum Yönetimi',
		permissions: [
			{ key: 'comment.read', label: 'Yorumları Görüntüle', description: 'Yorum listesini görüntüleme' },
			{ key: 'comment.write', label: 'Yorum Oluştur/Düzenle', description: 'Yorum ekleme ve güncelleme' },
			{ key: 'comment.delete', label: 'Yorum Sil', description: 'Yorum silme' },
			{ key: 'comment.moderate', label: 'Yorum Moderasyonu', description: 'Yorum onaylama ve moderasyon' }
		]
	},
	{
		name: 'pages',
		label: 'Sayfa Yönetimi',
		permissions: [
			{ key: 'page.read', label: 'Sayfaları Görüntüle', description: 'Sayfa listesini görüntüleme' },
			{ key: 'page.write', label: 'Sayfa Oluştur/Düzenle', description: 'Sayfa ekleme ve güncelleme' },
			{ key: 'page.delete', label: 'Sayfa Sil', description: 'Sayfa silme' }
		]
	},
	{
		name: 'roles',
		label: 'Rol Yönetimi',
		permissions: [
			{ key: 'role.read', label: 'Rolleri Görüntüle', description: 'Rol listesini görüntüleme' },
			{ key: 'role.write', label: 'Rol Oluştur/Düzenle', description: 'Rol ekleme ve güncelleme' },
			{ key: 'role.delete', label: 'Rol Sil', description: 'Rol silme' }
		]
	},
	{
		name: 'hashtags',
		label: 'Etiket Yönetimi',
		permissions: [
			{ key: 'hashtag.read', label: 'Etiketleri Görüntüle', description: 'Etiket listesini görüntüleme' },
			{ key: 'hashtag.write', label: 'Etiket Oluştur/Düzenle', description: 'Etiket ekleme ve güncelleme' },
			{ key: 'hashtag.delete', label: 'Etiket Sil', description: 'Etiket silme' }
		]
	},
	{
		name: 'sources',
		label: 'Kaynak Yönetimi',
		permissions: [
			{ key: 'source.read', label: 'Kaynakları Görüntüle', description: 'Kaynak listesini görüntüleme' },
			{ key: 'source.write', label: 'Kaynak Oluştur/Düzenle', description: 'Kaynak ekleme ve güncelleme' },
			{ key: 'source.delete', label: 'Kaynak Sil', description: 'Kaynak silme' }
		]
	},
	{
		name: 'telegram',
		label: 'Telegram Grup Yönetimi',
		permissions: [
			{ key: 'telegram.read', label: 'Grupları Görüntüle', description: 'Telegram grup listesini görüntüleme' },
			{ key: 'telegram.write', label: 'Grup Oluştur/Düzenle', description: 'Telegram grup ekleme ve güncelleme' },
			{ key: 'telegram.delete', label: 'Grup Sil', description: 'Telegram grup silme' }
		]
	},
	{
		name: 'settings',
		label: 'Sistem Ayarları',
		permissions: [
			{ key: 'settings.read', label: 'Ayarları Görüntüle', description: 'Sistem ayarlarını görüntüleme' },
			{ key: 'settings.write', label: 'Ayarları Düzenle', description: 'Sistem ayarlarını güncelleme' }
		]
	}
];
