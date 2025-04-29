import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { createImageKitInstance, uploadImageToImageKit } from '../utils/imagekit';
import { Post } from '../posts/entities/post.entity';
import { PostResponseDto } from '../posts/dto/post-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new UnauthorizedException('User not found');
    const mergeUserData = this.userRepository.merge(user, updateUserDto);
    const updatedUser = await this.userRepository.save(mergeUserData);
    return plainToInstance(UserResponseDto, updatedUser, { excludeExtraneousValues: true });
  }

  async updateImage(id: number, image: Express.Multer.File) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new UnauthorizedException('User not found');

    if (user.imageFileId) {
      try {
        const imagekit = createImageKitInstance();
        await imagekit.deleteFile(user.imageFileId);
      } catch (err) {
        console.warn('Old image deletion failed');
      }
    }

    const uploaded = await uploadImageToImageKit(image, 'users');
    user.image = uploaded.url;
    user.imageFileId = uploaded.fileId;
    const updatedUser = await this.userRepository.save(user);
    return plainToInstance(UserResponseDto, updatedUser, { excludeExtraneousValues: true });
  }

  async updatePassword(id: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new UnauthorizedException('User not found');
    if(changePasswordDto.newPassword !== changePasswordDto.confirmPassword) throw new UnauthorizedException('Passwords do not match');
    if(!(await user.comparePassword(changePasswordDto.currentPassword))) throw new UnauthorizedException('Current password is incorrect');

    user.password = changePasswordDto.newPassword;
    await this.userRepository.save(user);
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  async getPostsByUserId(id: number, query: { search?: string }) {
    const filter = { userId: id };
    if (query.search) filter['title'] = ILike(`%${query.search}%`);

    const posts = await this.postRepository.find({
      where: filter,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
    return {
      data: plainToInstance(PostResponseDto, posts, { excludeExtraneousValues: true }),
    }
  }
}
