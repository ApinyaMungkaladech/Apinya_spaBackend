import { Injectable } from '@nestjs/common';

import { User as UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { from, map, Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = UserEntity.create(createUserDto);
    await user.save();

    delete user.password;
    return user;
  }

  // async showById(id: number): Promise<UserEntity> {
  //   const user = await this.UserEntity(id);

  //   delete user.password;
  //   return user;
  // }

  findProfileById(userId: string): Observable<User> {
    return from(
      this.userRepository.findOne({ userId }, { relations: ['posts'] }),
    ).pipe(
      map((user: User) => {
        const { password, posts, createdAt, updatedAt, ...result } = user;
        return result;
      }),
    );
  }

  async findAll(): Promise<User[]> {
    return await UserEntity.find();
  }

  async findByEmail(email: string) {
    return await UserEntity.findOne({
      where: {
        email: email,
      },
    });
  }
}
