import { Injectable } from '@nestjs/common';

import { User as UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.interface';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  // async create(createUserDto: CreateUserDto) {
  //   const user = UserEntity.create(createUserDto);
  //   await user.save();

  //   delete user.password;
  //   return user;
  // }

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
        const { posts, createdAt, updatedAt, ...result } = user;
        return result;
      }),
    );
  }

  findUserPosts(userId: string): Observable<User> {
    return from(
      this.userRepository.findOne({ userId }, { relations: ['posts'] }),
    ).pipe(
      map((user: User) => {
        return user;
      }),
    );
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users: User[]) =>
        users.map((user: User) => {
          const { password, ...result } = user;
          return result;
        }),
      ),
    );
  }

  async findByEmail(email: string) {
    return await UserEntity.findOne({
      where: {
        email: email,
      },
    });
  }

  create(user: User): Observable<User> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new UserEntity();
        newUser.firstName = user.firstName;
        newUser.lastName = user.lastName;
        newUser.email = user.email;
        newUser.password = passwordHash;
        newUser.photo = user.photo;

        return from(this.userRepository.save(newUser)).pipe(
          map((user: User) => {
            const { password, ...result } = user;
            return result;
          }),
          catchError((err) => throwError(err)),
        );
      }),
    );
  }

  login(user: User): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((user: User) => {
        if (user) {
          return this.authService.generateJWT(user).pipe(
            map((jwt: string) => {
              return jwt;
            }),
          );
        } else {
          return 'Wrong Credentials';
        }
      }),
    );
  }

  validateUser(email: string, password: string): Observable<User> {
    return from(
      this.userRepository.findOne(
        { email },
        {
          select: [
            'userId',
            'password',
            'firstName',
            'lastName',
            'email',
            'photo',
          ],
        },
      ),
    ).pipe(
      switchMap((user: User) =>
        this.authService.comparePasswords(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...result } = user;
              return result;
            } else {
              throw Error;
            }
          }),
        ),
      ),
    );
  }
}
