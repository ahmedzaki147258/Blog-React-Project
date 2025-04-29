import { Expose, Transform  } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  @Transform(({ value }) => +value)
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  image: string;
}
