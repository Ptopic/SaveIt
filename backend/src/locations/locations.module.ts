import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
	providers: [LocationsService, PrismaService],
	controllers: [LocationsController],
})
export class LocationsModule {}
