import { Expose, Transform, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class PostResponseDto {
  @Expose()
  @Transform(({ value }) => +value)
  id: number;

  @Expose()
  title: string;

  @Expose()
  body: string;

  @Expose()
  image: string;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
