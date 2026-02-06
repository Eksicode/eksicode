'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import postService from '@/services/postService';
import PostForm, { PostFormData } from '@/components/PostForm';
import { toast } from 'react-hot-toast';

export default function CreatePostPage() {
    const router = useRouter();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: PostFormData) => {
        if (!token) {
            toast.error('Lütfen önce giriş yapın');
            return;
        }

        if (!data.title || !data.content || !data.categoryId) {
            toast.error('Lütfen zorunlu alanları doldurun');
            return;
        }

        setLoading(true);

        try {
            const tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

            const response = await postService.createPost({
                title: data.title,
                content: data.content,
                categoryId: data.categoryId,
                tags: tagsArray,
                headerImage: data.headerImage || undefined
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
            <PostForm mode="create" onSubmit={handleSubmit} loading={loading} />
        </div>
    );
}
