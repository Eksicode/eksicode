// Post status enum matching backend
export enum PostStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

// Media interface to match backend
export interface IMedia {
  id: number;
  url: string;
  altText?: string;
  type: string;
}

export interface IAuthor {
  id?: string;
  name?: string;
  username: string;
  profilePicture?: IMedia | null;
  firstName?: string;
  lastName?: string;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITag {
  id: number;
  name: string;
}

export interface IComment {
  id: string | number;
  content: string;
  userId?: string;
  authorId?: number;
  postId?: number;
  author: IAuthor;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPost {
  id: number;
  title: string;
  slug: string;
  content?: string; // Optional for summary response
  author: IAuthor;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  postLikes?: any[];
  image?: string; // Legacy field
  comments?: IComment[];
  categories?: IPostCategory[];
  tags: ITag[];
  status: PostStatusEnum | string; // Can be enum or string from API
  approved?: boolean;
  headerImage?: IMedia | string | null;
  viewCount?: number;
}

export interface IPostCategory {
  id: number;
  name: string;
  slug?: string;
}
