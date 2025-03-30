import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
	imports: [PrismaModule, CloudinaryModule],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {}
