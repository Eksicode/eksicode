"use client";
import React, { useState, useEffect } from 'react';
import Button from './Ui/Button';
import { ITag } from '@/types/types';
import getData from '@/utils/getData';

const NewPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as number[],
    status: 'DRAFT',
    slug: '',
    headerImage: ''
  });
  
  const [availableTags, setAvailableTags] = useState<ITag[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const tagsData = await getData<ITag>("hashtags", true, 100);
      setAvailableTags(tagsData.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleTagToggle = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Implement API call to create post
      console.log("Creating post:", formData);
      // Reset form after successful submission
      setFormData({
        title: '',
        content: '',
        tags: [],
        status: 'DRAFT',
        slug: '',
        headerImage: ''
      });
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-DarkerGrey rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Başlık *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleTitleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md shadow-sm focus:outline-none focus:ring-eksiCode focus:border-eksiCode dark:bg-DarkLightGrey dark:text-white"
            placeholder="Post başlığını girin..."
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md shadow-sm focus:outline-none focus:ring-eksiCode focus:border-eksiCode dark:bg-DarkLightGrey dark:text-white"
            placeholder="post-slug"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            İçerik *
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            required
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md shadow-sm focus:outline-none focus:ring-eksiCode focus:border-eksiCode dark:bg-DarkLightGrey dark:text-white"
            placeholder="Post içeriğini yazın..."
          />
        </div>

        {/* Header Image */}
        <div>
          <label htmlFor="headerImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Başlık Görseli URL
          </label>
          <input
            type="url"
            id="headerImage"
            value={formData.headerImage}
            onChange={(e) => setFormData(prev => ({ ...prev, headerImage: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md shadow-sm focus:outline-none focus:ring-eksiCode focus:border-eksiCode dark:bg-DarkLightGrey dark:text-white"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Etiketler
          </label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border border-gray-300 dark:border-DarkLightGrey rounded-md p-2">
            {availableTags.map((tag) => (
              <label key={tag.id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.tags.includes(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                  className="form-checkbox h-4 w-4 text-eksiCode"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{tag.name}</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">Seçilen etiketler: {formData.tags.length}</p>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Durum
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md shadow-sm focus:outline-none focus:ring-eksiCode focus:border-eksiCode dark:bg-DarkLightGrey dark:text-white"
          >
            <option value="DRAFT">Taslak</option>
            <option value="PUBLISHED">Yayınlandı</option>
            <option value="ARCHIVED">Arşivlendi</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              // Reset form
              setFormData({
                title: '',
                content: '',
                tags: [],
                status: 'DRAFT',
                slug: '',
                headerImage: ''
              });
            }}
          >
            Temizle
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !formData.title || !formData.content}
          >
            {loading ? 'Kaydediliyor...' : 'Post Oluştur'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewPost;