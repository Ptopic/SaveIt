import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CollectionsModule } from './collections/collections.module';
import { ImportsModule } from './imports/imports.module';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
	imports: [
		AuthModule,
		CollectionsModule,
		ImportsModule,
		CloudinaryModule,
		UsersModule,
		NotificationsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
