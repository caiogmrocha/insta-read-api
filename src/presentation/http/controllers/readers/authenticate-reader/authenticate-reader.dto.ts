import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthenticateReaderDto {
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @MinLength(12)
  public password: string;
}
