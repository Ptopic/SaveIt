import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImportsController } from './imports.controller';
import { ImportsService } from './imports.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
	providers: [ImportsService, PrismaService, NotificationsService],
	controllers: [ImportsController],
})
export class ImportsModule {}
