import { Injectable, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/entities/user.interface';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { Post as IPost } from './entities/post.interface';

const slugify = require('slugify');

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    private userService: UsersService,
  ) {}

  create(user: User, post: IPost): Observable<IPost> {
    post.author = user;
    return this.generateSlug(post.description.slice(0, 10)).pipe(
      switchMap((slug: string) => {
        post.slug = slug;
        return from(this.postRepository.save(post));
      }),
    );
  }

  findAll(): Observable<IPost[]> {
    return from(
      this.postRepository.find({
        order: { createdAt: 'DESC' },
        relations: ['author'],
      }),
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  generateSlug(title: string): Observable<string> {
    return of(slugify(title));
  }
}
