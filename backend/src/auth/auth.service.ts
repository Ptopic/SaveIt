import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthPayloadDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService
	) {}

	async signup(payload: AuthPayloadDto) {
		const newUser = await this.prisma.user.create({
			data: {
				email: payload.email,
				password: await bcrypt.hash(payload.password, 10),
			},
		});

		const token = await this.jwtService.signAsync({
			sub: newUser.id,
			email: newUser.email,
		});

		return { token };
	}

	async login(payload: AuthPayloadDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: payload.email,
			},
		});

		if (!user) {
			throw new ForbiddenException('Access denied');
		}

		const passwordMatches = await bcrypt.compare(
			payload.password,
			user.password
		);

		if (!passwordMatches) {
			throw new ForbiddenException('Access denied');
		}

		const token = await this.jwtService.signAsync({
			sub: user.id,
			email: user.email,
		});

		return { token };
	}
}
