import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  updateImage(id: number, updateUserDto: UpdateUserDto) {
    return `This action update image a #${id} user`;
  }

  updatePassword(id: number, updateUserDto: UpdateUserDto) {
    return `This action update password a #${id} user`;
  }

  getPostsByUserId(id: number) {
    return `This action returns all posts by user #${id}`;
  }
}
