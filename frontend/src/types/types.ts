export interface IAuthor {
  id?: string;
  name?: string;
  username: string;
  profilePicture: string | null;
}

export interface ITag {
  id: number;
  name: string;
}

export interface IComment {
  id: string;
  content: string;
  userId: string;
  author: IAuthor;
}

export interface IPost {
  id: number;
  title: string;
  slug: string;
  content?: string; // Optional for summary response
  author: IAuthor;
  createdAt: string;
  postLikes?: any[];
  image?: string;
  comments?: IComment[];
  categories?: any[];
  tags: ITag[];
}
