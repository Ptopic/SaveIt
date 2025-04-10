import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NotificationsService {
	async sendNotification(
		pushNotificationId: string,
		title: string,
		message: string
	) {
		axios.post(
			'https://onesignal.com/api/v1/notifications',
			{
				app_id: process.env.ONESIGNAL_APP_ID,
				include_player_ids: [pushNotificationId],
				headings: { en: title },
				contents: { en: message },
			},
			{
				headers: {
					Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
					'Content-Type': 'application/json',
				},
			}
		);
	}
}
