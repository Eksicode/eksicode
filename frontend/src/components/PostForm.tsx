'use client';

import React, { useEffect, useState } from 'react';
import postService from '@/services/postService';
import mediaService from '@/services/mediaService';
import TextEditor from '@/components/TextEditor';
import FileUpload from '@/components/FileUpload';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

export interface PostFormData {
    title: string;
    content: string;
    categoryId: number;
    tags: string;
    status?: string;
    headerImage?: File | null;
    headerImageId?: number;
}

interface PostFormProps {
    mode: 'create' | 'edit';
    initialData?: {
        title: string;
        content: string;
        categoryId: number;
        tags: string;
        status?: string;
        headerImageUrl?: string;
        headerImageId?: number;
    };
    onSubmit: (data: PostFormData) => Promise<void>;
    loading: boolean;
}

export default function PostForm({ mode, initialData, onSubmit, loading }: PostFormProps) {
    const { token } = useAuth();
    const [categories, setCategories] = useState<any[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        content: initialData?.content || '',
        categoryId: initialData?.categoryId || 0,
        tags: initialData?.tags || '',
        status: initialData?.status || '',
        headerImageId: initialData?.headerImageId || undefined,
    });
    const [headerImage, setHeaderImage] = useState<File | null>(null);
    const [showImageUpload, setShowImageUpload] = useState(!initialData?.headerImageUrl);

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

    const handleImageSelect = async (file: File) => {
        setHeaderImage(file);
        if (!token) {
            toast.error('Lütfen giriş yapın');
            return;
        }

        setUploadingImage(true);
        try {
            const response = await mediaService.uploadMedia(file, token);
            if (response.success && response.data) {
                setFormData(prev => ({ ...prev, headerImageId: response.data!.id }));
                toast.success('Kapak görseli yüklendi');
            } else {
                toast.error(response.message || 'Görsel yüklenemedi');
                setHeaderImage(null);
            }
        } catch (error) {
            toast.error('Görsel yüklenirken bir hata oluştu');
            setHeaderImage(null);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({
            ...formData,
            headerImage,
        });
    };

    const isEdit = mode === 'edit';

    return (
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
                {isEdit && initialData?.headerImageUrl && !showImageUpload ? (
                    <div className="space-y-2">
                        <img
                            src={initialData.headerImageUrl}
                            alt="Kapak görseli"
                            className="w-full max-h-12 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                        <button
                            type="button"
                            onClick={() => setShowImageUpload(true)}
                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                            Görseli Değiştir
                        </button>
                    </div>
                ) : (
                    <>
                        <FileUpload setFile={handleImageSelect} accept="image/*" />
                        {uploadingImage && <p className="mt-2 text-sm text-blue-600 animate-pulse">Görsel yükleniyor...</p>}
                        {headerImage && !uploadingImage && (
                            <div className="mt-4 flex flex-col items-center">
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 self-start font-medium">
                                    Seçilen dosya: <span className="text-green-600 font-normal">{headerImage.name}</span>
                                </p>
                                <div className="w-full mt-2 relative rounded-xl border border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-800 flex justify-center items-center p-4">
                                    <img
                                        src={URL.createObjectURL(headerImage)}
                                        alt="Seçilen görsel"
                                        className="h-auto max-h-64 w-auto object-contain rounded drop-shadow-md"
                                    />
                                </div>
                            </div>
                        )}
                        {isEdit && initialData?.headerImageUrl && (
                            <button
                                type="button"
                                onClick={() => {
                                    setShowImageUpload(false);
                                    setHeaderImage(null);
                                    setFormData(prev => ({ ...prev, headerImageId: initialData.headerImageId }));
                                }}
                                className="mt-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            >
                                İptal
                            </button>
                        )}
                    </>
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

            {/* Status (edit mode only) */}
            {isEdit && (
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Durum
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="DRAFT">Taslak</option>
                        <option value="PUBLISHED">Yayında</option>
                        <option value="ARCHIVED">Arşivlenmiş</option>
                    </select>
                </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading || uploadingImage}
                    className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${loading || uploadingImage
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading || uploadingImage
                        ? (isEdit ? 'Güncelleniyor...' : 'Yayınlanıyor...')
                        : (isEdit ? 'Güncelle' : 'Yayınla')
                    }
                </button>
            </div>
        </form>
    );
}
