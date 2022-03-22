import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { diskStorage } from 'multer';

import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';
import { Photo } from 'src/users/entities/photo.entity';
import { User } from './entities/user.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

const path = require('path');

export const storage = {
  storage: diskStorage({
    destination: './uploads/users-image',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('session')
  getSession(@Request() req) {
    const userId = req.user.userId;
    return this.usersService.findProfileById(userId);
  }

  // @Get(':id')
  // show(@Param('id') id: string) {
  //   return this.usersService.showById(+id);
  // }

  @Post('photo/upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Observable<Photo> {
    return of(file);
  }
}
