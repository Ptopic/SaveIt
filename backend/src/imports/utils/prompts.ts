export const detectContentTypePrompt = (description: string) => {
	const prompt = `
   You are a specialized content analyzer for social media videos with a critical responsibility to provide ONLY accurate, verified information. The user's decisions depend on your analysis, so accuracy is paramount.
   
   CONTENT TYPES (you must choose one of these or "Other"):
   - Software: Applications, tools, programming languages, tech platforms
   - Workout Routine: Exercise programs, fitness routines, training methods
   - Recipe: Food preparation, cooking instructions, dishes
   - Place: Travel destinations, landmarks, cities, countries, tourist attractions, parks, beaches, museums, historical sites, natural wonders, or any specific location being showcased or recommended
   - Film/Show: Movies, TV series, documentaries, streaming content
   - Restaurant: Dining establishments, cafes, food venues
   - Book: Literature, publications, reading materials
   - Product: Consumer goods, items for purchase, merchandise

   DESCRIPTION:
   "${description}"

   CRITICAL INSTRUCTIONS:
   1. ACCURACY FIRST: If you cannot verify the content type with high confidence, explicitly state "Other" rather than providing a potentially incorrect content type.
   
   2. CONTENT TYPE DETERMINATION - EXTREMELY IMPORTANT:
      - PLACE CATEGORIZATION: If the content mentions, shows, discusses, or recommends ANY specific physical location that people can visit (city, landmark, attraction, beach, park, museum, etc.), it MUST be categorized as "Place" - even if the location is only briefly mentioned
      - RESTAURANT CATEGORIZATION: If the content focuses on a specific restaurant, cafe, or food venue, categorize as "Restaurant" (not "Place")
      - DEFAULT TO "PLACE" FOR LOCATION CONTENT: When in doubt about content showing a physical location, categorize as "Place" rather than "Other"
      - Only use "Other" if the content truly doesn't fit any specific category
   
   Provide your analysis in this exact JSON format:
   {
     "type": "one of the specified content types or Other",
   }`;

	return prompt;
};

// Base wrapper prompt that handles common functionality
export const getBaseAnalyzePrompt = (
	transcript: string,
	contentFormat: 'video' | 'slideshow'
) => {
	const prompt = `
  You are a specialized content analyzer for social media videos with a critical responsibility to provide ONLY accurate, verified information. The user's decisions depend on your analysis, so accuracy is paramount.
  
  CONTENT TYPES (you must choose one of these or "Other"):
  - Software: Applications, tools, programming languages, tech platforms
  - Workout Routine: Exercise programs, fitness routines, training methods
  - Recipe: Food preparation, cooking instructions, dishes
  - Place: Travel destinations, landmarks, cities, countries, tourist attractions, parks, beaches, museums, historical sites, natural wonders, or any specific location being showcased or recommended
  - Film/Show: Movies, TV series, documentaries, streaming content
  - Restaurant: Dining establishments, cafes, food venues
  - Book: Literature, publications, reading materials
  - Product: Consumer goods, items for purchase, merchandise
  
  TRANSCRIPT AND DESCRIPTION:
  "${transcript}"

  CONTENT FORMAT: ${contentFormat}
  
  CRITICAL INSTRUCTIONS:
  1. ACCURACY FIRST: If you cannot verify information with high confidence, you MUST set the value as null.
  
  2. CONTENT TYPE DETERMINATION - EXTREMELY IMPORTANT:
     - PLACE CATEGORIZATION: If the content mentions, shows, discusses, or recommends ANY specific physical location that people can visit (city, landmark, attraction, beach, park, museum, etc.), it MUST be categorized as "Place" - even if the location is only briefly mentioned
     - RESTAURANT CATEGORIZATION: If the content focuses on a specific restaurant, cafe, or food venue, categorize as "Restaurant" (not "Place")
     - DEFAULT TO "PLACE" FOR LOCATION CONTENT: When in doubt about content showing a physical location, categorize as "Place" rather than "Other"
     - Only use "Other" if the content truly doesn't fit any specific category
  
  3. INFORMATION EXTRACTION:
     - Extract ONLY information explicitly stated in the transcript/description OR that you can verify through web search
     - For any information you add through web search, include "[Verified]" at the beginning
     - For any field where information is missing or cannot be verified, you MUST use null
     - NEVER use text placeholders like "Not available", "Unknown", "Not mentioned" - use null instead
     - NEVER invent or assume information not present in the source or verifiable through search

  4. FORMAT-SPECIFIC HANDLING:
     - For VIDEO content: Return a single detailed object about the main subject
     - For SLIDESHOW content: Return an array of objects, each describing a separate item/location/subject shown in the slideshow
     - For both formats: Maintain consistent structure but adapt between single object and array based on format
  
  5. FINAL VERIFICATION CHECKLIST:
     - Double-check that any content about a physical location is categorized as "Place"
     - Ensure all place-related content is categorized as "Place"
     - Confirm that all information is either from the transcript or verified through search
     - Verify that null is used for ALL missing or unverified information
     - Check that response format matches content format (single object for video, array for slideshow)
  `;

	return prompt;
};

// Recipe-specific prompt
const getRecipeAnalyzePrompt = () => {
	const prompt = `
  RECIPE ANALYSIS RULES:
  * Main description: 1-2 sentences about what this dish is
  * Type: "Main course", "Dessert", "Breakfast", etc.
  * Origin: Cuisine origin with appropriate flag emoji (🇮🇹 Italian, 🇲🇽 Mexican, 🇨🇳 Chinese, etc.)
  * Time: Total preparation and cooking time
  * Difficulty: Easy, Medium, or Hard
  * Spice level: If applicable
  * Diet: Vegetarian, Vegan, Gluten-free, etc. if applicable
  * Highlights: 2-3 key selling points or special features of this recipe
  * Quick Tips: [3-5 bullet points of practical tips mentioned in the video:
    - 💡 Preparation tips
    - 💡 Cooking technique tips
    - 💡 Ingredient selection tips
    - 💡 Time-saving tips
    - 💡 Flavor enhancement tips
  ]
  * Ingredients: [Bullet list of ingredients with quantities AND EMOJIS - place emoji BEFORE each ingredient name. Use these specific emojis for common ingredients:
    - 🍅 tomato/tomatoes
    - 🥔 potato/potatoes
    - 🍗 chicken
    - 🥩 beef/steak/meat
    - 🐖 pork
    - 🍞 bread
    - 🧀 cheese
    - 🥛 milk
    - 🧈 butter
    - 🧂 salt
    - 🌶️ pepper/chili
    - 🧄 garlic
    - 🧅 onion
    - 🍚 rice
    - 🌽 corn
    - 🥕 carrot
    - 🍋 lemon
    - 🍯 honey
    - 🫚 olive oil/oil
    - 🥚 egg
    - 🥜 nuts/peanuts
    - 🌰 hazelnuts/chestnuts
    - 🫐 berries
    - 🍎 apple
    - 🥬 lettuce/greens
    - 🍇 grapes/raisins
    - 🧁 cake/cupcake
    - 🍫 chocolate
    - 🧂 spices (general)
    - 🧊 ice
    - 🍬 candy
    - 🌿 herbs (general)
    - 🌱 fresh herbs
    - 🥦 broccoli/green vegetables
    - 🧅 shallots
    - 🥒 cucumber
    - 🥭 mango
    - 🍍 pineapple
    - 🥥 coconut
    - 🍊 orange/citrus
    - 🧄 ginger (if no ginger emoji)
    - 🍯 syrup
    - 🥃 bourbon/whiskey
    - 🍷 wine
    - 🍺 beer
    - 🦪 seafood
    - 🦐 shrimp/prawns
    - 🦑 squid/calamari
    - 🐟 fish
    - 🦀 crab
    - 🥫 canned goods
    - 🫘 beans/legumes
    - 🌶️ spicy ingredients
    - 🍄 mushrooms
    - 🧆 falafel/meatballs
    - 🥙 wraps/tortillas
    - 🥗 salad ingredients
    - 🫓 flatbread/pita
    
    For sugar and sweeteners:
    - 🧂 sugar (general)
    - 🍚 white sugar
    - 🟤 brown sugar
    
  EMOJI SELECTION PRIORITY:
  1. ALWAYS use the most specific ingredient emoji that matches the actual ingredient
  2. If no exact match, use an emoji for a similar ingredient in the same food category
  3. For prepared ingredients (like sauces), use an emoji for the main ingredient
  4. For spice blends, use 🧂 or an emoji for the dominant spice
    
  For measurements with no specific ingredient emoji (USE ONLY AS LAST RESORT):
  - 🥄 for teaspoon (tsp) or tablespoon (tbsp) measurements
  - 🧊 for cup measurements
  - 🧂 for pinch/dash
  - 🍶 for liquid measurements (ml, oz, etc.)
  - ⚖️ for weight measurements (g, kg, oz, lb)
    
  Only use measurement emojis when you cannot find ANY suitable food emoji for the ingredient. Make every effort to use a food-related emoji that represents the ingredient or its category before falling back to measurement emojis.]
    
  * Steps: [Numbered list of preparation steps with relevant emojis BEFORE each step: 🔪 (cutting/chopping), 🍳 (frying/cooking), 🌡️ (temperature/heating), ⏲️ (timing), 🌀 (mixing/stirring), 🧊 (freezing/cooling), 🥣 (combining ingredients), 🔥 (baking/roasting), 💧 (washing/rinsing), 🧴 (marinating), etc.]
  * Time: [⏱️ Prep/cooking time]
  * Serves: [🍽️ Number of servings]
  * Tips: [💡 2-3 cooking tips or variations specifically mentioned in the video]
  * Creator Insights: [👨‍🍳 Special techniques, personal touches, or unique approaches mentioned by the video creator]
  * Serving Suggestions: [🍴 How to serve/present the dish, garnishes, accompaniments]
  * Substitutions: [🔄 Common substitutions for ingredients mentioned in the video]
  * Background: [📜 Cultural, historical or personal story about the recipe if mentioned]
  * Health Notes: [❤️ Any health benefits or nutritional information mentioned]
  * Equipment: [🍲 Special equipment or tools needed for the recipe]
  * Storage: [🧊 Information about storing leftovers or meal prep if mentioned]
  * Did You Know: [✨ Interesting facts or trivia about the dish or ingredients mentioned in the video]
  `;

	return prompt;
};

// Place-specific prompt
const getPlaceAnalyzePrompt = () => {
	const prompt = `
  PLACE ANALYSIS RULES:
  * Name: [Appropriate emoji BEFORE place name: 🏰 (castle), 🏝️ (beach), 🏞️ (nature), 🏛️ (monument), etc., followed by exact name of the place/attraction/landmark]
  * Location: [COUNTRY FLAG emoji + 📍 followed by city name - e.g. "🇮🇹 📍 Rome" or "🇺🇸 📍 New York". Always include the country flag emoji based on location]
  * Highlights: [Bullet list with relevant emojis BEFORE each highlight]
  * Best time to visit: [🗓️ Season or months]
  * Tips: [💡 1-2 short travel tips]
  * Description: [ℹ️ Brief 1-2 sentence description]
  
  LOCATION NAME RULES:
  - Prioritize major city/region names
  - Use widely recognized names
  - Include single primary location
  
  ADDRESS SEARCH INSTRUCTIONS:
  1. Identify exact place name
  2. Search multiple sources
  3. Include full address details
  4. Use null if not found
  `;

	return prompt;
};

// Restaurant-specific prompt
const getRestaurantAnalyzePrompt = () => {
	const prompt = `
  RESTAURANT ANALYSIS RULES:
  * Name: [🍽️ Exact name of the restaurant]
  * Cuisine: [Relevant food emoji BEFORE cuisine type: 🍕 (Italian), 🍣 (Japanese), 🌮 (Mexican), etc.]
  * Location: [COUNTRY FLAG emoji + 📍 followed by city name - e.g. "🇫🇷 📍 Paris". Always include the country flag emoji based on location]
  * Must-try dishes: [Bullet list with relevant food emojis BEFORE each dish]
  * Price range: [💰 Budget indicator]
  * Hours: [🕒 Opening hours if mentioned]
  
  ADDRESS SEARCH INSTRUCTIONS:
  1. Search exact restaurant name
  2. Check multiple review sites
  3. Include complete address
  4. Use null if not found
  `;

	return prompt;
};

// Software-specific prompt
const getSoftwareAnalyzePrompt = () => {
	const prompt = `
  SOFTWARE ANALYSIS RULES:
  * Purpose: [🎯 Main functionality]
  * Features: [Bullet list with relevant tech emojis BEFORE each feature]
  * Platforms: [Device emojis BEFORE platform types: 📱 (mobile), 💻 (desktop), etc.]
  * Pricing: [💰 Cost information if mentioned]
  
  PLATFORM EMOJI MAPPING:
  - 📱 Mobile/iOS/Android
  - 💻 Desktop/PC/Mac
  - 🌐 Web/Browser
  - 🎮 Gaming consoles
  - 📺 Smart TV/streaming devices
  
  FEATURE EMOJI MAPPING:
  - 🔒 Security/Privacy
  - 💾 Storage/Backup
  - 🔄 Sync/Integration
  - 📊 Analytics/Reports
  - 🎨 Design/Customization
  - 🤖 Automation
  - 📱 Mobile features
  - 💬 Communication
  - 🎯 Productivity
  - ⚙️ Settings/Configuration
  `;

	return prompt;
};

// Film/Show-specific prompt
const getFilmShowAnalyzePrompt = () => {
	const prompt = `
  FILM/SHOW ANALYSIS RULES:
  * Genre: [Relevant genre emoji BEFORE genre type: 😂 (comedy), 😱 (horror), etc.]
  * Platform: [📺 Where to watch]
  * Release: [📅 When released]
  * Starring: [🌟 Main actors]
  * Plot: [📖 1-2 sentence summary without spoilers]
  * Rating: [⭐ Audience/critic ratings if mentioned]
  * Duration: [⏱️ Runtime/episodes]
  * Creator: [🎬 Director/Producer]
  
  GENRE EMOJI MAPPING:
  - 😂 Comedy
  - 😱 Horror
  - 💕 Romance
  - 🎭 Drama
  - 🔍 Mystery
  - 🚀 Sci-Fi
  - 🦸‍♂️ Superhero
  - 🎬 Documentary
  - 🎵 Musical
  - 🎪 Family/Animation
  - 🔫 Action
  - 🌍 International
  `;

	return prompt;
};

// Workout Routine-specific prompt
const getWorkoutAnalyzePrompt = () => {
	const prompt = `
  WORKOUT ROUTINE ANALYSIS RULES:
  * Target: 🎯 Muscle groups/fitness goals
  * Exercises: Bullet list with fitness emojis
  * Sets/Reps: 🔄 Recommended sets and repetitions
  * Duration: ⏱️ Time required
  * Equipment: 🏋️ Required equipment
  * Difficulty: 📊 Beginner/Intermediate/Advanced
  * Rest: ⏸️ Rest periods
  * Warmup: 🔥 Warmup routine
  * Tips: 💡 Form and technique tips
  
  EXERCISE EMOJI MAPPING:
  - 🏋️ Weights/Strength
  - 🏃 Cardio/Running
  - 🧘 Yoga/Stretching
  - 💪 Bodyweight
  - 🚲 Cycling
  - 🏊 Swimming
  - 🤸 Calisthenics
  - 🎯 Target exercises
  - ⚖️ Balance work
  - 🔄 Circuit training
  `;

	return prompt;
};

// Book-specific prompt
const getBookAnalyzePrompt = () => {
	const prompt = `
  BOOK ANALYSIS RULES:
  * Author: [✍️ Writer's name]
  * Genre: [Relevant emoji BEFORE book type]
  * Key themes: [🔑 Bullet list of main themes]
  * Brief plot: [📖 1-2 sentence summary without spoilers]
  * Publication: [📅 Release date if mentioned]
  * Publisher: [🏢 Publishing house]
  * Format: [📚 Available formats]
  * Length: [📏 Page count/duration]
  * Awards: [🏆 Notable awards/recognition]
  * Reviews: [⭐ Notable reviews/ratings]
  
  GENRE EMOJI MAPPING:
  - 📚 Fiction
  - 🔍 Mystery
  - 💕 Romance
  - 🚀 Sci-Fi
  - 🗺️ Adventure
  - 📖 Non-fiction
  - 💭 Philosophy
  - 📈 Business
  - 🎨 Art/Design
  - 👨‍🍳 Cooking
  - 🧠 Self-help
  - 📜 History
  `;

	return prompt;
};

// Product-specific prompt
const getProductAnalyzePrompt = () => {
	const prompt = `
  PRODUCT ANALYSIS RULES:
  * Name: [Relevant emoji BEFORE product name]
  * Type: [Category emoji BEFORE product category]
  * Features: [Bullet list with relevant emojis BEFORE each feature]
  * Price: [💰 Cost if mentioned]
  * Where to buy: [🏬 Purchase locations]
  * Brand: [™️ Manufacturer/brand]
  * Availability: [🛍️ Where to purchase]
  * Variants: [🎨 Available options/models]
  * Reviews: [⭐ Notable reviews/ratings]
  * Warranty: [⚡ Warranty information]
  * Shipping: [🚚 Delivery options]
  
  PRODUCT CATEGORY EMOJI MAPPING:
  - 📱 Electronics/Gadgets
  - 👕 Clothing/Fashion
  - 🏠 Home/Furniture
  - 🧴 Beauty/Personal Care
  - 🎮 Gaming/Entertainment
  - 🏃 Sports/Fitness
  - 🎨 Art/Craft Supplies
  - 🔧 Tools/Hardware
  - 🎁 Gifts/Accessories
  - 🧸 Toys/Games
  - 🪴 Garden/Outdoor
  - 🏥 Health/Wellness
  `;

	return prompt;
};

const getOtherAnalyzePrompt = () => {
	const prompt = `
  OTHER ANALYSIS RULES:
  * Description: [ℹ️ Brief 1-2 sentence description]
  `;

	return prompt;
};

export const getAnalyzePromptByContentType = (
	transcript: string,
	contentType: string,
	contentFormat: 'video' | 'slideshow'
) => {
	const basePrompt = getBaseAnalyzePrompt(transcript, contentFormat);

	const typeSpecificPrompts = {
		Recipe: getRecipeAnalyzePrompt(),
		Place: getPlaceAnalyzePrompt(),
		Restaurant: getRestaurantAnalyzePrompt(),
		Software: getSoftwareAnalyzePrompt(),
		'Film/Show': getFilmShowAnalyzePrompt(),
		'Workout Routine': getWorkoutAnalyzePrompt(),
		Book: getBookAnalyzePrompt(),
		Product: getProductAnalyzePrompt(),
		Other: getOtherAnalyzePrompt(),
	};

	const typeSpecificPrompt = typeSpecificPrompts[contentType];

	const prompt = `
  ${basePrompt}
  
  CONTENT TYPE SPECIFIC RULES:
  ${typeSpecificPrompt}
  
  You must respond with ONLY a JSON object in the following format, with no additional text or explanation:
  {
    "type": "${contentType}",
    "title": "clear and descriptive title",
    "summary": contentFormat === 'video' ? {
      // Single object containing the content type specific data
      // e.g. for Place: name, location, highlights etc.
      // for Restaurant: name, cuisine, location etc.
      ...typeSpecificPrompts[contentType].fields
    } : [
      // Array of objects for slideshow, each containing content type specific data
      {
        ...typeSpecificPrompts[contentType].fields
      }
    ]
  }
  
  Do not include any text outside the JSON. The response must be valid parseable JSON.`;

	return prompt;
};
