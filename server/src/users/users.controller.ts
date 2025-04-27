import { Controller, Body, Patch, Param, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch(':id/change-image')
  updateImage(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateImage(+id, updateUserDto);
  }

  @Patch(':id/change-password')
  updatePassword(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updatePassword(+id, updateUserDto);
  }

  @Get(':id/posts')
  getPostsByUserId(@Param('id') id: string) {
    return this.usersService.getPostsByUserId(+id);
  }
}
