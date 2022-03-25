import { Post } from 'src/posts/entities/post.interface';

export interface User {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  photo?: string;
  posts?: Post[];
}

export interface SafeUser {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
}
