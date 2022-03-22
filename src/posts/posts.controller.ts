import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';
import { Photo } from './entities/photo.entity';

import path = require('path');
import { Post as IPost } from './entities/post.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

export const storage = {
  storage: diskStorage({
    destination: './uploads/posts-image',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() post: IPost, @Request() req): Observable<IPost> {
    const user = req.user;
    return this.postsService.create(user, post);
  }

  // @Post()
  // create(@Body() createPostDto: CreatePostDto) {
  //   return this.postsService.create(createPostDto);
  // }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Post('photo/upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Observable<Photo> {
    return of(file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
