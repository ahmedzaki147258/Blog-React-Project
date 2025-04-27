import { IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  @Matches(/^\S[^\s@]*@\S[^\s.]*\.\S+$/)
  email: string;

  @IsString()
  password: string;

  image?: string;
}
