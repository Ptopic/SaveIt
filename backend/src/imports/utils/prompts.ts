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
  - Event: Music concerts, shows, festivals, sports events, etc.
  
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
     - **USE CAPITAL LETTERS FOR CONTENT TYPES AS SPECIFIED IN RULES: Always use capitalized content type names like "Name" for Place, "Cuisine" for Restaurant, etc.**

  3. MULTIPLE ITEMS AND DUPLICATE PREVENTION - CRITICAL:
     A. LOCATION HIERARCHY RULES:
        1. REQUIRED FIELDS (CRITICAL):
           - Every place MUST have these fields:
             * Name: [Place emoji + name]
             * City: [City name or null - see city rules below]
             * Country: [Full country name]
             * Flag: [Country flag emoji - MANDATORY]
             * Description: [Brief description]
           
           FLAG EMOJI RULES:
           - Flag field is MANDATORY for all entries
           - Use the correct country flag emoji
           - Common flags (MUST use these exact emojis):
             * 🇮🇹 Italy
             * 🇫🇷 France
             * 🇪🇸 Spain
             * 🇩🇪 Germany
             * 🇬🇧 United Kingdom
             * 🇺🇸 United States
             * 🇯🇵 Japan
             * 🇨🇳 China
             * 🇰🇷 South Korea
             * 🇮🇳 India
             * 🇧🇷 Brazil
             * 🇲🇽 Mexico
             * 🇨🇦 Canada
             * 🇦🇺 Australia
             * 🇳🇿 New Zealand
           
           EXAMPLES:
           ✅ CORRECT:
           {
             "Name": "🍕 Spontini",
             "City": "Milan",
             "Country": "Italy",
             "Flag": "🇮🇹",
             "Description": "Popular pizza place in Milan"
           }
           
           ❌ INCORRECT:
           {
             "Name": "🍕 Spontini",
             "City": "Milan",
             "Country": "Italy"
             // WRONG! Missing Flag field
           }

        2. CITY FIELD RULES:
           - City field should ONLY be filled when the place is within a specific city
           - For standalone places (lakes, regions, etc.), leave City as null
           - For places within cities, City should be the containing city name
           
           EXAMPLES:
           ✅ CORRECT:
           - Place in city:
             {
               "Name": "🗼 Eiffel Tower",
               "City": "Paris",
               "Country": "France",
               "Flag": "🇫🇷"
             }
           
           - Standalone place:
             {
               "Name": "🌊 Lake Como",
               "City": null,
               "Country": "Italy",
               "Flag": "🇮🇹"
             }
           
           ❌ INCORRECT:
           - Don't duplicate name as city:
             {
               "Name": "🌊 Lake Como",
               "City": "Lake Como",  // WRONG! Don't use place name as city
               "Country": "Italy",
               "Flag": "🇮🇹"
             }
           
           - Don't use region as city:
             {
               "Name": "🏰 Neuschwanstein Castle",
               "City": "Bavaria",    // WRONG! Region is not a city
               "Country": "Germany",
               "Flag": "🇩🇪"
             }

        3. SEPARATE ENTRIES FOR:
           - Individual attractions (museums, landmarks, villas, etc.)
           - Specific towns or cities
           - Distinct points of interest
           - Each restaurant or venue
           - Any location with its own address or coordinates
        
        4. GROUP AS HIGHLIGHTS ONLY:
           - General viewpoints without specific locations
           - Generic features of a place
           - Non-specific recommendations
           - Tips about the general area
        
        5. EXAMPLES:
           ✅ CORRECT (Separate entries for distinct locations):
           {
             "summary": [
               {
                 "Name": "🌊 Lake Como",
                 "City": null,
                 "Country": "Italy",
                 "Flag": "🇮🇹",
                 "Description": "Beautiful lake in northern Italy",
                 "Highlights": ["Stunning views", "Crystal clear waters"]
               },
               {
                 "Name": "🏛️ Villa Carlotta",
                 "City": "Tremezzo",
                 "Country": "Italy",
                 "Flag": "🇮🇹",
                 "Description": "Historic villa with beautiful gardens"
               },
               {
                 "Name": "🏛️ Villa Balbianello",
                 "City": "Lenno",
                 "Country": "Italy",
                 "Flag": "🇮🇹",
                 "Description": "Famous villa with spectacular views"
               }
             ]
           }
           
           ❌ INCORRECT (Places as highlights):
           {
             "summary": [
               {
                 "Name": "🌊 Lake Como",
                 "City": "Lake Como",
                 "Country": "Italy",
                 "Highlights": [
                   "Villa Carlotta in Tremezzo",
                   "Villa Balbianello in Lenno"
                 ]
               }
             ]
           }
     
     B. INITIAL SCAN:
        - First scan ALL content (transcript/description/images) to identify ALL mentioned items
        - Create a master list of unique items based on name, location, and key identifiers
        - For locations: use name + city/country combination as unique identifier
        - For other items: use name + key distinguishing features
        - IMPORTANT: Identify distinct locations vs general highlights
     
     C. STRICT DUPLICATE DETECTION:
        Check these criteria IN ORDER to identify duplicates:
        1. EXACT MATCHES:
           - Identical names (case-insensitive)
           - Same name with different emojis
           - Same coordinates/address
        
        2. SIMILAR NAMES:
           - Different spellings (e.g., "St." vs "Saint")
           - Translated names (e.g., "Florence" vs "Firenze")
           - Common abbreviations (e.g., "NYC" vs "New York City")
        
        3. LOCATION MATCHES:
           - Same physical location with different names
           - Same address with different business names
           - Same coordinates with different descriptions
     
     D. INFORMATION MERGING RULES:
        When duplicates are found, merge information following these rules:
        1. KEEP BEST INFORMATION:
           - Most complete name/title
           - Most detailed description
           - Most accurate location data
           - Most recent information
        
        2. COMBINE UNIQUE DETAILS:
           - Merge unique highlights/features
           - Combine non-redundant tips
           - Aggregate distinct categories
           - Keep all valid alternative names
        
        3. RESOLVE CONFLICTS:
           - Use most commonly reported data
           - For conflicts, keep most authoritative source
           - For equal authority, keep most detailed
           - For equal detail, keep most recent
     
     E. FINAL OUTPUT STRUCTURE:
        {
          "title": "descriptive_title",
          "summary": [
            {
              // SINGLE merged entry for each unique item
              // All information combined following merge rules
              // NO duplicate entries allowed
              // Each distinct location as separate entry
            }
          ]
        }

  4. INFORMATION EXTRACTION:
     - Extract information explicitly stated in the transcript/description
     - For any missing information, ACTIVELY SEARCH the web to find accurate data
     - Follow the detailed search instructions in the category-specific rules below
     - For any field where information cannot be found or verified even after web search, use null
     - NEVER use text placeholders like "Not available", "Unknown", "Not mentioned" - use null instead
     - NEVER invent or assume information not present in the source or verifiable through search

  5. WEB SEARCH GUIDELINES:
     - Prioritize official sources (publisher sites, official business pages, etc.)
     - Cross-reference information across multiple reliable sources
     - For conflicting information, use the most commonly reported data or null
     - Ensure all searched information is current and accurate
     - If information varies by region/edition/version, specify which one
     
  6. MULTIPLE ITEMS RESPONSE FORMAT:
     When multiple items are detected, structure the response as:
     {
       "title": "descriptive_title_for_collection",
       "summary": [
           {
             ...item_specific_fields_following_type_guidelines
           }
       ]
     }
  
  7. FINAL VERIFICATION CHECKLIST:
     - Double-check that any content about a physical location is categorized as "Place"
     - Ensure all place-related content is categorized as "Place"
     - Confirm that all information is either from the transcript or verified through search
     - Verify that null is used for ALL missing or unverified information
     - Check that response format matches content format (single object for video, array for slideshow)
     - For multiple items: verify each item has complete information
     - For multiple items: confirm no duplicates exist in final output
     - For locations: verify each distinct location is a separate entry
     - CRITICAL: Verify every entry has a Flag field with the correct country flag emoji

  8. TRANSLATION:
     - Ensure all extracted information is translated to English.
  `;

	return prompt;
};

// Recipe-specific prompt
const getRecipeAnalyzePrompt = () => {
	const prompt = `
  RECIPE ANALYSIS RULES:
  * Name: [🍽️ Exact name of the recipe]
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
  * Nutrition Facts: [IMPORTANT - YOU MUST ALWAYS CALCULATE ESTIMATED NUTRITION FACTS:
    1. For EACH ingredient:
      - Look up standard nutrition values per serving/amount
      - Calculate based on recipe quantity
    2. Sum ALL ingredients to get recipe totals
    3. REQUIRED VALUES (do not skip any):
      - 🥩 Total Protein (g) 
      - 🥖 Total Carbohydrates (g)
      - 🫚 Total Fat (g)
      - 🔥 Total Calories
    4. If exact amounts unclear:
      - Use reasonable estimates based on similar recipes
      - Err on higher side for calories
    5. NEVER return null or skip nutrition facts
    6. Round to nearest whole number]

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
    
  EMOJI SELECTION RULES (STRICT PRIORITY ORDER):
  
  1. FOOD EMOJIS ONLY - FOLLOW THIS ORDER:
     a. EXACT ingredient emoji match (e.g. 🥕 for carrot)
     b. SIMILAR ingredient in same category (e.g. 🥬 for kale if no specific kale emoji)
     c. MAIN ingredient for prepared foods (e.g. 🫘 for refried beans)
     d. PRIMARY ingredient for blends (e.g. 🌶️ for chili powder)
  
  2. MEASUREMENT EMOJIS - USE ONLY IF NO FOOD EMOJI EXISTS:
     ⚠️ IMPORTANT: NEVER combine food emojis with measurement emojis
     ⚠️ ONLY use these if NO suitable food emoji can be found:
     - 🥄 for tsp/tbsp
     - 🧊 for cups
     - 🧂 for pinch/dash
     - 🍶 for liquids
     - ⚖️ for weights
  
  EXAMPLES:
  ✅ CORRECT:
  - "1 cup carrots" = 🥕
  - "1 tbsp soy sauce" = 🫗
  - "1 cup water" = 🍶 (only because no specific water emoji exists)
  
  ❌ INCORRECT:
  - "1 cup carrots" = 🥕🧊 (NEVER combine)
  - "1 tbsp soy sauce" = 🫗🥄 (NEVER combine)
    
  * Steps: [Numbered list of preparation steps with relevant emojis BEFORE each step: 🔪 (cutting/chopping), 🍳 (frying/cooking), 🌡️ (temperature/heating), ⏲️ (timing), 🌀 (mixing/stirring), 🧊 (freezing/cooling), 🥣 (combining ingredients), 🔥 (baking/roasting), 💧 (washing/rinsing), 🧴 (marinating), etc.]
  * Time: [⏱️ Prep/cooking time]
  * Serves: [🍽️ Number of servings]
  * Tips: [💡 2-3 cooking tips or variations specifically mentioned in the video]
  * Creator Insights: [👨‍🍳 Special techniques, personal touches, or unique approaches mentioned by the video creator]
  * Serving Suggestions: [🍴 How to serve/present the dish, garnishes, accompaniments]
  * Substitutions: [🔄 Common substitutions for ingredients mentioned in the video]
  * Background: [📜 Cultural, historical or personal story about the recipe if mentioned]
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
  * Name: [PLACE EMOJI SELECTION - FOLLOW THIS STRICT ORDER:
    1. PLACE TYPE EMOJIS (try these first):
       - 🏰 Castle/Palace/Fort
       - 🏛️ Museum/Monument/Historic Building
       - ⛪ Church/Temple/Religious Site
       - 🏝️ Beach/Island
       - 🏞️ National Park/Nature Reserve
       - 🗽 Landmark/Statue
       - 🌋 Volcano/Mountain
       - 🏔️ Mountain Range/Peak
       - 🌊 Ocean/Sea/Lake
       - 🌳 Park/Garden
       - 🏟️ Stadium/Arena
       - 🎪 Theme Park/Circus
       - 🎭 Theater/Opera House
       - 🏨 Hotel/Resort
       - 🏖️ Beach Resort
       - 🏺 Archaeological Site
       - 🗿 Ancient Ruins
       
    2. ACTIVITY EMOJIS (if no place emoji matches):
       - 🏄‍♀️ Surfing Spot
       - 🏊‍♀️ Swimming Location
       - 🧗‍♀️ Climbing Area
       - 🚶‍♀️ Hiking Trail
       - ⛷️ Ski Resort
       - 🛍️ Shopping District
       - 🎨 Art Gallery
       - 🎢 Amusement Park
       - ⛳ Golf Course
       - 🎣 Fishing Spot
       
    3. CONTEXTUAL EMOJIS (if no activity emoji matches):
       - 🌸 Garden/Flower Park
       - 🦁 Zoo/Safari
       - 🐠 Aquarium
       - 🌺 Botanical Garden
       - 🍷 Winery/Vineyard
       - 🌿 Nature Area
       - 💦 Waterfall/Spring
       - ❄️ Ice/Snow Feature
       - 🌅 Sunset Viewpoint
       - 🎵 Music Venue
       
    4. SEASONAL/EVENT EMOJIS:
       - 🎄 Christmas Market/Event
       - 🎋 Festival Site
       - 🎡 Fair/Carnival Ground
       - 🎪 Circus/Show Venue
       
    5. DEFAULT EMOJI:
       - 📍 ONLY use if none of the above categories match
       
    IMPORTANT: You MUST try emojis from each category in order before using 📍.
    NEVER skip categories or default to 📍 without checking all options first.]
  * City: [city name - e.g. "Rome" or "New York"]
  * Country: [country name - e.g. "Italy" or "United States"]
  * Flag: [COUNTRY FLAG emoji - e.g. "🇮🇹" or "🇺🇸"]
  * Highlights: [Bullet list with relevant emojis BEFORE each highlight]
  * Best time to visit: [Season or months]
  * Tips: [1-2 short travel tips with 💡 emoji BEFORE each tip]
  * Description: [Brief 1-2 sentence description]
  * Categories: [Bullet list of a few categories that the place belongs to]
  
  CITY NAME RULES:
  - Prioritize major city/region names
  - Use widely recognized names
  - Include single primary city name
  
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
  * Name: [Use a cuisine-related emoji BEFORE restaurant name based on the restaurant's style of food. Choose from these cuisine emojis:
    - 🍝 (Italian/pasta)
    - 🍣 (Japanese/sushi)
    - 🍔 (American/burgers)
    - 🌮 (Mexican/tacos)
    - 🍜 (Chinese/noodles)
    - 🥘 (Spanish/paella)
    - 🍕 (Pizza)
    - 🥩 (Steakhouse/grill)
    - 🍚 (Asian/rice dishes)
    - 🥗 (Salad/health food)
    - 🍛 (Indian/curry)
    - 🍤 (Seafood)
    - 🥐 (French/bakery)
    - 🧆 (Middle Eastern/falafel)
    - 🍦 (Dessert/ice cream)
    - 🥪 (Sandwich/deli)
    - 🍗 (Chicken/wings)
    - 🍖 (BBQ/meat)
    - 🥟 (Dumplings/dim sum)
    - 🧀 (Cheese/fondue)
    - 🍮 (Dessert/custard)
    - 🍩 (Donuts/pastries)
    - 🍱 (Bento/Asian fusion)
    - 🍲 (Stew/hotpot)
    - 🍹 (Cocktail bar)
    - 🍺 (Brewery/pub)
    - 🍷 (Wine bar)
    - 🍵 (Tea house)
    - ☕ (Coffee shop)
    
    If no specific cuisine emoji matches, use 🍽️ as default]
  * City: [city name - e.g. "Rome" or "New York"]
  * Country: [country name - e.g. "Italy" or "United States"]
  * Flag: [COUNTRY FLAG emoji - e.g. "🇮🇹" or "🇺🇸"]
  * Cuisine: [Relevant flag emoji BEFORE cuisine type: 🇮🇹 (Italian), 🇯🇵 (Japanese), 🇲🇽 (Mexican), etc.]
  * Must-try dishes: [Bullet list with relevant food emojis BEFORE each dish]
  * Description: [Brief 1-2 sentence description]
  * Categories: [Bullet list of specific attributes or features of the restaurant, such as ambiance, type of cuisine, special services, etc.]
   
  CITY NAME RULES:
  - Prioritize major city/region names
  - Use widely recognized names
  - Include single primary city name
  
  ADDRESS SEARCH INSTRUCTIONS:
  1. Identify exact place name
  2. Search multiple sources
  3. Include full address details
  4. Use null if not found
  `;

	return prompt;
};

// Software-specific prompt
const getSoftwareAnalyzePrompt = () => {
	const prompt = `
  SOFTWARE ANALYSIS RULES:
  * Name: [💻 Exact name of the software]
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
  * Name: [🎬 Exact name of the film/show]
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
  * Name: [🏋️ Exact name of the workout routine]
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
  * Title: [🔍 Title of the book]
  * Author: [✍️ Writer's name]
  * Genre: [Relevant emoji BEFORE book type]
  * Key themes: [🔑 Bullet list of main themes]
  * Brief plot: [📖 1-2 sentence summary without spoilers]
  * Publication: [📅 Release date if mentioned]
  * Publisher: [🏢 Publishing house]
  * Format: [📚 Available formats]
  * Length: [📏 Page count/duration]
  * Series: [📚 Series name and book number if part of a series]
  * Goodreads: [📊 Average rating and number of ratings if available] 
  
  BOOK SEARCH INSTRUCTIONS:
  1. MANDATORY SEARCH STEPS:
     a) FIRST: Search for exact book title and author combination
        - Example search: "Book Title by Author Name Goodreads"
        - Look for the official Goodreads book page
     
     b) FROM GOODREADS PAGE EXTRACT:
        - REQUIRED: Page count (number only)
        - REQUIRED: Publication date (full date if available)
        - REQUIRED: Publisher name
        - REQUIRED: Average rating (X.XX format)
        - REQUIRED: Total number of ratings
        - Available formats
        - Series information

  2. DATA FORMATTING:
     - Page count: Number only (e.g. "324" not "324 pages")
     - Publication date: "YYYY-MM-DD" format
     - Average rating: "X.XX" format
     - Number of ratings: Number only (e.g. "1234" not "1,234 ratings")
     - Publisher: Official publisher name only

  3. NULL VALUE RULES:
     - Use null ONLY if information cannot be found after searching both Goodreads AND publisher website
     - Do not use null if information exists but in different format
     - Do not skip search steps - all steps are mandatory

  4. EXAMPLE RESPONSE FORMAT:
     {
       "pageCount": 324,
       "publicationDate": "2024-01-15",
       "publisher": "Penguin Random House",
       "averageRating": "4.25",
       "totalRatings": 1234,
       "formats": ["Hardcover", "Paperback", "Kindle", "Audiobook"],
       "series": "Series Name #1" // or null if not part of series
     }

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

const getEventAnalyzePrompt = () => {
	const prompt = `
  EVENT ANALYSIS RULES:
  * Name: [🎉 Event name]
  * Type: [Category emoji BEFORE event type]
  * Location: [COUNTRY FLAG emoji + 📍 followed by city name - e.g. "🇺🇸 📍 New York". Always include the country flag emoji based on location]
  * Date: [📅 Event date]
  * Time: [🕒 Event time]
  * Price: [💰 Ticket price]
  * Tickets: [🎫 Purchase link]
  * Description: [ℹ️ Brief 1-2 sentence description]
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
		Event: getEventAnalyzePrompt(),
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
