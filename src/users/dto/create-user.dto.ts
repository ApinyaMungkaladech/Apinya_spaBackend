import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  firstName: string;

  lastName: string;

  @IsNotEmpty()
  password: string;
}
