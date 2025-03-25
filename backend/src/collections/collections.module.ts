import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
	providers: [CollectionsService, PrismaService, CloudinaryService],
	controllers: [CollectionsController],
})
export class CollectionsModule {}
