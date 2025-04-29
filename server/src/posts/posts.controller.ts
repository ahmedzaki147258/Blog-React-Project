import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query, UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageValidationPipe } from '../utils/image-validation.pipe';
import { AuthGuard } from '../auth/auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query() query: { page?: number; limit?: number; search?: string }) {
    return this.postsService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createPostDto: CreatePostDto, @UploadedFile(imageValidationPipe) image: Express.Multer.File,) {
    return this.postsService.create(createPostDto, image);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Patch(':id/change-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  updateImage(@Param('id') id: string, @UploadedFile(imageValidationPipe) image: Express.Multer.File) {
    return this.postsService.updateImage(+id, image);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
