import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) throw new UnauthorizedException('Authorization header is missing');

    try {
      req.user = this.jwtService.verify(token);
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
