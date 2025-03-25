import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CollectionsModule } from './collections/collections.module';
import { ImportsModule } from './imports/imports.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
	imports: [AuthModule, CollectionsModule, ImportsModule, CloudinaryModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
