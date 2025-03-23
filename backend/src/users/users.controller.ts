// import {
// 	Body,
// 	Controller,
// 	Delete,
// 	Get,
// 	NotFoundException,
// 	Param,
// 	ParseIntPipe,
// 	Patch,
// 	Post,
// } from '@nestjs/common';
// import { CreateUserDto } from './dtos/createUser.dto';
// import { UpdateUserDto } from './dtos/updateUser.dto';
// import { UpdateUserSettingsDto } from './dtos/updateUserSettings.dto';
// import { UsersService } from './users.service';

// @Controller('users')
// export class UsersController {
// 	constructor(private usersService: UsersService) {}

// 	@Post()
// 	createUser(@Body() createUserDto: CreateUserDto) {
// 		return this.usersService.createUser(createUserDto);
// 	}

// 	@Get()
// 	getUsers() {
// 		return this.usersService.getUsers();
// 	}

// 	@Get(':id')
// 	async getUserById(@Param('id', ParseIntPipe) id: number) {
// 		const user = await this.usersService.getUserById(id);

// 		if (!user) throw new NotFoundException('User not found');

// 		return user;
// 	}

// 	@Patch(':id')
// 	async updateUserById(
// 		@Param('id', ParseIntPipe) id: number,
// 		@Body() updateUserDto: UpdateUserDto
// 	) {
// 		return this.usersService.updateUserById(id, updateUserDto);
// 	}

// 	@Delete(':id')
// 	async deleteUserById(@Param('id', ParseIntPipe) id: number) {
// 		return this.usersService.deleteUserById(id);
// 	}

// 	@Patch(':id/settings')
// 	updateUserSettingsByUserId(
// 		@Param('id', ParseIntPipe) id: number,
// 		@Body() updateUserSettingsDto: UpdateUserSettingsDto
// 	) {
// 		return this.usersService.updateUserSettingsByUserId(
// 			id,
// 			updateUserSettingsDto
// 		);
// 	}
// }
