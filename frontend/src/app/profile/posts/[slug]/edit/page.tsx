'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import postService from '@/services/postService';
import { getAllHashtags } from '@/services/hashtagService';
import PostForm, { PostFormData } from '@/components/PostForm';
import { IPost, IMedia } from '@/types/types';
import { toast } from 'react-hot-toast';

function getHeaderImageUrl(headerImage: IMedia | string | null | undefined): string | undefined {
    if (!headerImage) return undefined;
    if (typeof headerImage === 'string') return headerImage;
    return headerImage.url;
}

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;
    const { user, token, isLoading: authLoading } = useAuth();

    const [post, setPost] = useState<IPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (authLoading) return;

        const fetchPost = async () => {
            const response = await postService.getPostBySlug(slug);

            if (!response.success || !response.data) {
                setError(response.message || 'Gönderi bulunamadı');
                setLoading(false);
                return;
            }

            const postData = response.data;

            // Client-side ownership check
            if (user && String(postData.author?.id) !== String(user.id) && String(postData.author?.username) !== user.username) {
                setError('Bu gönderiyi düzenleme yetkiniz yok');
                setLoading(false);
                return;
            }

            setPost(postData);
            setLoading(false);
        };

        if (slug) {
            fetchPost();
        }
    }, [slug, user, authLoading]);

    const handleSubmit = async (data: PostFormData) => {
        if (!token || !post) {
            toast.error('Lütfen önce giriş yapın');
            return;
        }

        if (!data.title || !data.content || !data.categoryId) {
            toast.error('Lütfen zorunlu alanları doldurun');
            return;
        }

        setSubmitting(true);

        try {
            // Resolve tag names to IDs
            const tagNames = data.tags.split(',').map(t => t.trim()).filter(t => t !== '');
            let tagIds: number[] = [];

            if (tagNames.length > 0) {
                const hashtagResponse = await getAllHashtags(1, 200);
                const allHashtags = hashtagResponse.data;

                tagIds = tagNames
                    .map(name => allHashtags.find(h => h.name.toLowerCase() === name.toLowerCase()))
                    .filter((h): h is NonNullable<typeof h> => h != null)
                    .map(h => h.id);
            }

            const response = await postService.updatePost(post.id, {
                title: data.title,
                content: data.content,
                categories: [data.categoryId],
                tags: tagIds,
                status: data.status,
            }, token);

            if (response.success) {
                toast.success('Gönderi başarıyla güncellendi');
                router.push('/profile/posts');
            } else {
                toast.error(response.message || 'Bir hata oluştu');
            }
        } catch (error) {
            console.error('Update post error:', error);
            toast.error('Bir hata oluştu');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    if (!post) return null;

    const initialData = {
        title: post.title,
        content: post.content || '',
        categoryId: post.categories?.[0]?.id || 0,
        tags: post.tags?.map(t => t.name).join(', ') || '',
        status: typeof post.status === 'string' ? post.status : 'DRAFT',
        headerImageUrl: getHeaderImageUrl(post.headerImage),
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Gönderiyi Düzenle</h1>
            <PostForm
                mode="edit"
                initialData={initialData}
                onSubmit={handleSubmit}
                loading={submitting}
            />
        </div>
    );
}
