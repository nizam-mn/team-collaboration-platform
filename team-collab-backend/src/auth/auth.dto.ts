import { IsEmail, MinLength, IsString, Length } from 'class-validator';

export class SignupDto {

  @IsString()
  @Length(3, 20)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
} 

export class LoginDto {
  @IsEmail()
  email!: string;
  
  @IsString()
  password!: string;
}
