// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { CreateUserDto } from './dtos/createUser.dto';
// import { UpdateUserDto } from './dtos/updateUser.dto';
// import { UpdateUserSettingsDto } from './dtos/updateUserSettings.dto';

// @Injectable()
// export class UsersService {
// 	constructor(private prisma: PrismaService) {}

// 	createUser(data: CreateUserDto) {
// 		return this.prisma.user.create({
// 			data: {
// 				...data,
// 				userSettings: {
// 					create: {
// 						notificationsEnabled: false,
// 						smsEnabled: true,
// 					},
// 				},
// 			},
// 		});
// 	}

// 	getUsers() {
// 		return this.prisma.user.findMany({
// 			include: {
// 				userSettings: true,
// 			},
// 		});
// 	}

// 	getUserById(id: number) {
// 		return this.prisma.user.findUnique({
// 			where: { id },
// 			include: {
// 				userSettings: {
// 					select: {
// 						notificationsEnabled: true,
// 						smsEnabled: true,
// 					},
// 				},
// 				posts: true,
// 			},
// 		});
// 	}

// 	async updateUserById(id: number, data: UpdateUserDto) {
// 		const foundUser = await this.getUserById(id);
// 		if (!foundUser) throw new NotFoundException('User not found');

// 		if (data.username) {
// 			const existingUser = await this.prisma.user.findUnique({
// 				where: { username: data.username as string },
// 			});
// 			if (existingUser) throw new NotFoundException('Username already exists');
// 		}

// 		return this.prisma.user.update({
// 			where: { id },
// 			data,
// 		});
// 	}

// 	async deleteUserById(id: number) {
// 		const foundUser = await this.getUserById(id);
// 		if (!foundUser) throw new NotFoundException('User not found');
// 		return this.prisma.user.delete({
// 			where: { id },
// 		});
// 	}

// 	async updateUserSettingsByUserId(
// 		userId: number,
// 		data: UpdateUserSettingsDto
// 	) {
// 		const foundUser = await this.getUserById(userId);
// 		if (!foundUser) throw new NotFoundException('User not found');
// 		if (!foundUser.userSettings)
// 			throw new NotFoundException('User settings not found');

// 		return this.prisma.userSettings.update({
// 			where: {
// 				userId,
// 			},
// 			data,
// 		});
// 	}
// }
