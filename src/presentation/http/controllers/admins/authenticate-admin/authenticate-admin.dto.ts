import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthenticateAdminDto {
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @MinLength(12)
  public password: string;
}
