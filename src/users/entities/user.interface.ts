import { Post } from 'src/posts/entities/post.interface';

export interface User {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  image?: string;
  posts?: Post[];
}
