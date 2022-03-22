import { User } from 'src/users/entities/user.interface';

export interface Post {
  id?: string;
  slug?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  likes?: number;
  photo?: string;
  author?: User;
}
