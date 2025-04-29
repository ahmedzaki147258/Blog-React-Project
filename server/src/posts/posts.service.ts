import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { createImageKitInstance, uploadImageToImageKit } from '../utils/imagekit';
import { plainToInstance } from 'class-transformer';
import { PostResponseDto } from './dto/post-response.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async findAll(query: { page?: number; limit?: number; search?: string }) {
    const filter = {};
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    if (query.search) filter['title'] = ILike(`%${query.search}%`);

    const [posts, total] = await this.postRepository.findAndCount({
      where: filter,
      order: { createdAt: 'DESC' },
      take: limit,
      skip: skip,
      relations: ['user'],
    });
    return {
      data: plainToInstance(PostResponseDto, posts, { excludeExtraneousValues: true }),
      total: total,
      totalPages: Math.ceil(total / limit)
    };
  }

  async create(createPostDto: CreatePostDto, image: Express.Multer.File) {
    const user = await this.userRepository.findOne({ where: { id: createPostDto.userId } });
    if (!user) throw new UnauthorizedException('User not found');
    const post = this.postRepository.create(createPostDto);
    const uploaded = await uploadImageToImageKit(image, 'posts');
    post.image = uploaded.url;
    post.imageFileId = uploaded.fileId;
    const newPost = await this.postRepository.save(post);
    return { data: plainToInstance(PostResponseDto, newPost, { excludeExtraneousValues: true }) };
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({ where: { id: id } });
    if (!post) throw new UnauthorizedException('Post not found');
    const mergePostData = this.postRepository.merge(post, updatePostDto);
    const updatedPost = await this.postRepository.save(mergePostData);
    return { data: plainToInstance(PostResponseDto, updatedPost, { excludeExtraneousValues: true }) };
  }

  async updateImage(id: number, image: Express.Multer.File) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) throw new UnauthorizedException('Post not found');

    if (post.imageFileId) {
      try {
        const imagekit = createImageKitInstance();
        await imagekit.deleteFile(post.imageFileId);
      } catch (err) {
        console.warn('Old image deletion failed');
      }
    }

    const uploaded = await uploadImageToImageKit(image, 'posts');
    post.image = uploaded.url;
    post.imageFileId = uploaded.fileId;
    const updatedPost = await this.postRepository.save(post);
    return { data: plainToInstance(PostResponseDto, updatedPost, { excludeExtraneousValues: true }) };
  }

  async remove(id: number) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) throw new UnauthorizedException('Post not found');

    if (post.imageFileId) {
      try {
        const imagekit = createImageKitInstance();
        await imagekit.deleteFile(post.imageFileId);
      } catch (err) {
        console.warn('Old image deletion failed');
      }
    }

    await this.postRepository.delete(id);
    return { message: 'Post deleted successfully' };
  }
}
