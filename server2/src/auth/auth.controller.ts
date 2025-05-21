import { Body, Controller, Get, Post, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto){
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto){
    return this.authService.register(createUserDto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Headers('authorization') authHeader: string){
    const token = authHeader?.split(' ')[1];
    return this.authService.me(token);
  }
}
