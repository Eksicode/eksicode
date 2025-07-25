"use client";
import React, { useState, useEffect } from "react";
import DataTable from "@/components/Ui/DataTable";
import Navlink from "@/components/Ui/NavLink";
import ReusableSearch from "@/components/Ui/ReusableSearch";
import getData from "@/utils/getData";
import { IPost, PostStatusEnum } from "@/types/types";

export const dynamic = "force-dynamic";

function DashboardPosts() {
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsData = await getData<IPost>("posts", false, 50); // Get more posts for admin dashboard
      setAllPosts(postsData.data);
      
      const preparedData = postsData.data.map((post) => ({
        id: post.id,
        title: post.title.length > 50 ? post.title.substring(0, 50) + "..." : post.title,
        author: post.author.username,
        tags: post.tags.map(tag => tag.name).join(", ") || "No tags",
        status: post.status === PostStatusEnum.PUBLISHED || post.status === "PUBLISHED" ? "Published" : "Draft",
        createdAt: new Date(post.createdAt).toLocaleDateString(),
        slug: post.slug,
        approved: post.approved ? "Yes" : "No",
      }));
      
      setFilteredPosts(preparedData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      // Reset to all posts
      const preparedData = allPosts.map((post) => ({
        id: post.id,
        title: post.title.length > 50 ? post.title.substring(0, 50) + "..." : post.title,
        author: post.author.username,
        tags: post.tags.map(tag => tag.name).join(", ") || "No tags",
        status: post.status === PostStatusEnum.PUBLISHED || post.status === "PUBLISHED" ? "Published" : "Draft",
        createdAt: new Date(post.createdAt).toLocaleDateString(),
        slug: post.slug,
        approved: post.approved ? "Yes" : "No",
      }));
      setFilteredPosts(preparedData);
      return;
    }

    const filtered = allPosts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.author.username.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.name.toLowerCase().includes(query.toLowerCase()))
    );

    const preparedFiltered = filtered.map((post) => ({
      id: post.id,
      title: post.title.length > 50 ? post.title.substring(0, 50) + "..." : post.title,
      author: post.author.username,
      tags: post.tags.map(tag => tag.name).join(", ") || "No tags",
      status: post.status === PostStatusEnum.PUBLISHED || post.status === "PUBLISHED" ? "Published" : "Draft",
      createdAt: new Date(post.createdAt).toLocaleDateString(),
      slug: post.slug,
      approved: post.approved ? "Yes" : "No",
    }));

    setFilteredPosts(preparedFiltered);
  };

  const handleDelete = async (id: number) => {
    // TODO: Implement delete functionality
    console.log("Delete post:", id);
  };

  const handleEdit = async (id: number) => {
    // TODO: Implement edit functionality
    console.log("Edit post:", id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading posts...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between w-full items-center mb-5">
        <div>
          <h1 className="mt-2 w-full">Posts ({filteredPosts.length})</h1>
        </div>
        <div>
          <Navlink href="/dashboard/posts/yeni" variant="primary">
            + Yeni Post
          </Navlink>
        </div>
      </div>
      
      {/* Search */}
      <div className="mb-4 w-full">
        <ReusableSearch 
          placeholder="Başlık, yazar veya etiket ara..."
          onChange={handleSearch}
          className="w-full md:w-1/3"
        />
      </div>

      {/* Posts Table */}
      <DataTable
        data={filteredPosts}
        onView={true}
        onEdit={true}
        onDelete={true}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </>
  );
}

export default DashboardPosts;
