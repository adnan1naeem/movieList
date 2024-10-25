import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class SigninDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
