export interface IAuthor {
  id: string;
  name: string;
}

export interface IComment {
  id: string;
  content: string;
  userId: string;
  author: IAuthor;
}

export interface IPost {
  id: string;
  title: string;
  content: string;
  author: IAuthor;
  postLikes: any[];
  comments: IComment[];
  categories: any[];
  tags: any[];
}
