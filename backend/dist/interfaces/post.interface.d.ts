declare enum PostStatusEnum {
    draft = "draft",
    published = "published",
    archived = "archived"
}
interface User {
    id: number;
}
interface PostLike {
    id: number;
    postId: number;
    userId: number;
}
interface Comment {
    id: number;
    postId: number;
    userId: number;
    content: string;
    createdAt: Date;
}
interface PostCategory {
    id: number;
    name: string;
}
interface HashTag {
    id: number;
    name: string;
}
export interface IPost {
    id: number;
    title: string;
    content: string;
    headerImage?: string;
    authorId: number;
    author: User;
    postLikes: PostLike[];
    comments: Comment[];
    categories: PostCategory[];
    tags: HashTag[];
    status: PostStatusEnum;
    slug: string;
    approved: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export {};
