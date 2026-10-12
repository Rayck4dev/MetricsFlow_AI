import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^[0-9.\-/]+$/, {
    message:
      'O documento deve conter apenas números, pontos, barras ou hífens.',
  })
  document?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^[0-9()+\-\s]+$/, {
    message: 'O telefone contém caracteres inválidos.',
  })
  phone_number?: string;
}
