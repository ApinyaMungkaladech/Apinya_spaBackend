import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';

import { User } from 'src/users/entities/user.interface';
import { UsersService } from 'src/users/users.service';
import { AuthLoginDto } from './dto/auth-login.dto';
const bcrypt = require('bcrypt');
@Injectable()
export class AuthService {
  // constructor(
  //   private usersService: UsersService,
  //   private jwtService: JwtService,
  // ) {}

  // async login(authLoginDto: AuthLoginDto) {
  //   const user = await this.validateUser(authLoginDto);

  //   const payload = {
  //     userId: user.userId,
  //   };

  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  // async validateUser(authLoginDto: AuthLoginDto): Promise<User> {
  //   const { email, password } = authLoginDto;

  //   const user = await this.usersService.findByEmail(email);

  //   if (!(await user?.validatePassword(password))) {
  //     throw new UnauthorizedException();
  //   }

  //   console.log('user at login : ', user);
  //   return user;
  // }
  constructor(private readonly jwtService: JwtService) {}

  generateJWT(user: User): Observable<string> {
    return from(this.jwtService.signAsync({ userId: user.userId }));
  }

  hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }

  comparePasswords(newPassword: string, passwordHash: string): Observable<any> {
    return from(bcrypt.compare(newPassword, passwordHash));
  }
}
