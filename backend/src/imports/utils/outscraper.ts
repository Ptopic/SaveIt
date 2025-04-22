export const getOutscraperData = async (queries: string[]) => {
	console.log(queries);
	const queriesString = queries.map((query) => `query=${query}`).join('&');

	console.log(queriesString);

	const params = `?${queriesString}&limit=1&async=false&fields=name,place_id,google_id,full_address,latitude,longitude,popular_times,site,phone,type,description,typical_time_spent,reviews_tags,rating,reviews,photo,working_hours,business_status,range,location_link`;
	const url = `https://api.app.outscraper.com/maps/search-v3${params}`;

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${process.env.OUTSCRAPER_API_KEY}`,
		},
	});

	const data = await response.json();

	return data.data;
};
