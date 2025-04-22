from TikTokApi import TikTokApi
import asyncio
import os
import sys
import json

ms_token = os.environ.get(
    "ms_token", None
)  # set your own ms_token, think it might need to have visited a profile


async def get_video_info(url, post_type):
    async with TikTokApi() as api:
        await api.create_sessions(ms_tokens=[ms_token], num_sessions=1, sleep_after=3, browser=os.getenv("TIKTOK_BROWSER", "chromium"))
        video = api.video(
            url=url
        )

        video_info = await video.info()
        desc = video_info['desc']

        cover = video_info['video']['cover']

        image_urls = []

        if post_type == "slideshow":
            for image in video_info["imagePost"]["images"]:
                image_urls.append(image["imageURL"]["urlList"][0])

        return {
            "description": desc,
            "cover": cover,
            "images": image_urls
         }
    
if __name__ == "__main__":
    # Check if URL parameter is provided
    if len(sys.argv) < 2:
        print("Please provide a TikTok video URL as a parameter.")
        sys.exit(1)

    # Get the URL from the command-line argument
    video_url = sys.argv[1]

    post_type = sys.argv[2]

    # Fetch video info
    video_data = asyncio.run(get_video_info(video_url, post_type))

    # Output the result as JSON
    print(json.dumps(video_data))
