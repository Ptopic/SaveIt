import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';

@Module({
	providers: [CollectionsService, PrismaService],
	controllers: [CollectionsController],
})
export class CollectionsModule {}
