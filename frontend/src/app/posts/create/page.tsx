'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import postService from '@/services/postService';
import TextEditor from '@/components/TextEditor';
import FileUpload from '@/components/FileUpload';
import { toast } from 'react-hot-toast'; // Assuming react-hot-toast is used, otherwise will use alert or simple UI feedback

export default function CreatePostPage() {
    const router = useRouter();
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        categoryId: 0,
        tags: '',
    });
    const [headerImage, setHeaderImage] = useState<File | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const cats = await postService.getCategories();
            setCategories(cats);
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'categoryId' ? Number(value) : value
        }));
    };

    const handleContentChange = (content: string) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error('Lütfen önce giriş yapın');
            return;
        }

        if (!formData.title || !formData.content || !formData.categoryId) {
            toast.error('Lütfen zorunlu alanları doldurun');
            console.log('Missing fields:', formData);
            return;
        }

        setLoading(true);

        try {
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

            const response = await postService.createPost({
                title: formData.title,
                content: formData.content,
                categoryId: formData.categoryId,
                tags: tagsArray,
                headerImage: headerImage || undefined
            }, token);

            if (response.success) {
                toast.success('Gönderi başarıyla oluşturuldu');
                router.push('/profile/posts');
            } else {
                toast.error(response.message || 'Bir hata oluştu');
            }
        } catch (error) {
            console.error('Create post error:', error);
            toast.error('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Yeni Gönderi Oluştur</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Başlık
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Gönderi başlığını girin"
                        required
                    />
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Kategori
                    </label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                    >
                        <option value={0}>Kategori Seçin</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Header Image */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Kapak Görseli
                    </label>
                    <FileUpload setFile={setHeaderImage} />
                    {headerImage && (
                        <p className="mt-2 text-sm text-green-600">
                            Seçilen dosya: {headerImage.name}
                        </p>
                    )}
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        İçerik
                    </label>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
                        <TextEditor
                            value={formData.content}
                            onChange={handleContentChange}
                            placeholder="İçeriğinizi buraya yazın..."
                        />
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Etiketler (Virgül ile ayırın)
                    </label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="örn: javascript, react, web development"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${loading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Yayınlanıyor...' : 'Yayınla'}
                    </button>
                </div>
            </form>
        </div>
    );
}
