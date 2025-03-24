import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuth } from './decorators/jwt-auth.decorator';
import { AuthPayloadDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('register')
	register(@Body() payload: AuthPayloadDto) {
		return this.authService.register(payload);
	}

	@Post('login')
	login(@Body() payload: AuthPayloadDto) {
		return this.authService.login(payload);
	}

	@Get('me')
	@JwtAuth()
	me(@Req() req: Request) {
		return req.user;
	}
}
