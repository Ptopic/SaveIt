import { createClient } from '@deepgram/sdk';
import { exec } from 'child_process';
import * as fs from 'fs';

export async function downloadAudio(videoUrl) {
	return new Promise((resolve, reject) => {
		const outputFilename = 'audio.mp3';

		const command = `yt-dlp -x --audio-format mp3 -o ${outputFilename} "${videoUrl}" --quiet --no-warnings`;
		exec(command, (error, stdout, stderr) => {
			if (error) {
				return reject(error);
			}

			if (fs.existsSync(outputFilename)) {
				resolve(outputFilename);
			} else {
				reject(new Error('MP3 file not found'));
			}
		});
	});
}

// async function transcribeAudio(filePath) {
// 	const audioFile = fs.createReadStream(filePath);
// 	const response = await openai.audio.transcriptions.create({
// 		model: 'whisper-1',
// 		file: audioFile,
// 		response_format: 'json',
// 	});
// 	return response.text;
// }

export async function transcribeAudioWithDeepgram(filePath) {
	const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
	const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
		fs.readFileSync(filePath),
		{
			model: 'nova-3',
			smart_format: true,
		}
	);
	if (error) throw error;
	return {
		duration: result.metadata.duration,
		text: result.results.channels[0].alternatives[0].transcript,
	};
}
