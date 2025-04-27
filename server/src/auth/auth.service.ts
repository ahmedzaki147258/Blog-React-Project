import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email.toLowerCase() },
    });

    if (!user || !(await user.comparePassword(loginDto.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload);
    return { token, userId: user.id };
  }

  async register(createUserDto: CreateUserDto) {
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email.toLowerCase() },
    });
    if (existing) throw new ConflictException('Email already in use');

    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return { message: 'User registered successfully' };
  }

  async me(token: string) {
    const decoded = this.jwtService.verify(token);
    const user = await this.userRepository.findOne({
      where: { id: decoded.sub },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
