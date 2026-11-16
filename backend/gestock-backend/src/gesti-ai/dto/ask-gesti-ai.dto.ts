
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Matches,
} from 'class-validator';

export class AskGestiAiDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(400)
  @Matches(/\S/, {
    message: 'La pregunta no puede estar vacía.',
  })
  question!: string;
}
