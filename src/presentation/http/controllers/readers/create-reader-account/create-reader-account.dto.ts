import { MinLength, IsNotEmpty, IsEmail } from "class-validator";

export class CreateReaderAccountDto {
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @MinLength(12)
  public password: string;
}
