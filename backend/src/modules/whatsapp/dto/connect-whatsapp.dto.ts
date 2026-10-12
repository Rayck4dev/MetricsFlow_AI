import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ConnectWhatsappDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phoneNumber!: string;
}
