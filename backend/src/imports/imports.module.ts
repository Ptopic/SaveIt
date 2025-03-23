import { Module } from '@nestjs/common';
import { ImportsController } from './imports.controller';
import { ImportsService } from './imports.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
	providers: [ImportsService, PrismaService],
	controllers: [ImportsController],
})
export class ImportsModule {}
