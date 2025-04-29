import {
  Controller,
  Body,
  Patch,
  Param,
  Get,
  UploadedFile,
  UseInterceptors, Query, UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageValidationPipe } from '../utils/image-validation.pipe';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch(':id/change-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  updateImage(@Param('id') id: string,  @UploadedFile(imageValidationPipe) image: Express.Multer.File) {
    return this.usersService.updateImage(+id, image);
  }

  @Patch(':id/change-password')
  @UseGuards(AuthGuard)
  updatePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.updatePassword(+id, changePasswordDto);
  }

  @Get(':id/posts')
  getPostsByUserId(@Param('id') id: string, @Query() query: { search?: string }) {
    return this.usersService.getPostsByUserId(+id, query);
  }
}
