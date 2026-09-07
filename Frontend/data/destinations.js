const destinations = [

    // ==================== KERALA ====================

    {
        name: "Alappuzha",
        state: "kerala",
        description: "Famous for peaceful backwaters and traditional houseboats.",
        rating: 4.7,
        category: "Nature",
        imageQuery: "Alappuzha Kerala"
    },

    {
        name: "Munnar",
        state: "kerala",
        description: "Misty hills, tea plantations and beautiful valleys.",
        rating: 4.8,
        category: "Nature",
        imageQuery: "Munnar Kerala"
    },

    {
        name: "Wayanad",
        state: "kerala",
        description: "Lush forests, waterfalls and scenic landscapes.",
        rating: 4.6,
        category: "Adventure",
        imageQuery: "Wayanad Kerala"
    },

    {
        name: "Kovalam",
        state: "kerala",
        description: "A beautiful coastal destination with golden beaches.",
        rating: 4.5,
        category: "Nature",
        imageQuery: "Kovalam Kerala"
    },

    {
        name: "Kochi",
        state: "kerala",
        description: "A vibrant city known for history, culture and heritage.",
        rating: 4.6,
        category: "Heritage",
        imageQuery: "Kochi Kerala"
    },

    {
        name: "Thekkady",
        state: "kerala",
        description: "Explore wildlife, forests and the famous Periyar region.",
        rating: 4.7,
        category: "Adventure",
        imageQuery: "Thekkady Kerala"
    },


    // ==================== TELANGANA ====================

    {
        name: "Hyderabad",
        state: "telangana",
        description: "A historic city blending grand monuments, culture and modern life.",
        rating: 4.7,
        category: "Heritage",
        imageQuery: "Hyderabad Telangana"
    },

    {
        name: "Warangal",
        state: "telangana",
        description: "A historic destination known for forts, temples and Kakatiya heritage.",
        rating: 4.6,
        category: "Heritage",
        imageQuery: "Warangal Telangana"
    },

    {
        name: "Ramappa Temple",
        state: "telangana",
        description: "A remarkable Kakatiya-era temple known for its intricate architecture.",
        rating: 4.8,
        category: "Heritage",
        imageQuery: "Ramappa Temple Telangana"
    },

    {
        name: "Nagarjuna Sagar",
        state: "telangana",
        description: "A scenic destination surrounded by reservoirs, history and natural beauty.",
        rating: 4.5,
        category: "Nature",
        imageQuery: "Nagarjuna Sagar Telangana"
    },

    {
        name: "Bhongir Fort",
        state: "telangana",
        description: "An impressive hilltop fort offering panoramic views of the surrounding region.",
        rating: 4.5,
        category: "Adventure",
        imageQuery: "Bhongir Fort Telangana"
    },

    {
        name: "Medak Cathedral",
        state: "telangana",
        description: "A striking historic church known for its distinctive architecture.",
        rating: 4.4,
        category: "Heritage",
        imageQuery: "Medak Cathedral Telangana"
    },


    // ==================== TAMIL NADU ====================

    {
        name: "Chennai",
        state: "tamilNadu",
        description: "A vibrant coastal city known for culture, temples, beaches and cuisine.",
        rating: 4.6,
        category: "Culture",
        imageQuery: "Chennai Tamil Nadu"
    },

    {
        name: "Madurai",
        state: "tamilNadu",
        description: "An ancient cultural city dominated by the magnificent Meenakshi Temple.",
        rating: 4.8,
        category: "Heritage",
        imageQuery: "Madurai Tamil Nadu"
    },

    {
        name: "Ooty",
        state: "tamilNadu",
        description: "A scenic hill station surrounded by tea estates and misty mountains.",
        rating: 4.7,
        category: "Nature",
        imageQuery: "Ooty Tamil Nadu"
    },

    {
        name: "Mahabalipuram",
        state: "tamilNadu",
        description: "A coastal heritage town famous for ancient stone temples and sculptures.",
        rating: 4.8,
        category: "Heritage",
        imageQuery: "Mahabalipuram Tamil Nadu"
    },

    {
        name: "Rameswaram",
        state: "tamilNadu",
        description: "A sacred island destination known for its temple and coastal landscapes.",
        rating: 4.7,
        category: "Spirituality",
        imageQuery: "Rameswaram Tamil Nadu"
    },

    {
        name: "Kodaikanal",
        state: "tamilNadu",
        description: "A peaceful hill station surrounded by forests, lakes and mountain scenery.",
        rating: 4.6,
        category: "Nature",
        imageQuery: "Kodaikanal Tamil Nadu"
    },


    // ==================== KARNATAKA ====================

    {
        name: "Bengaluru",
        state: "karnataka",
        description: "A modern technology hub with gardens, culture and vibrant city life.",
        rating: 4.6,
        category: "Culture",
        imageQuery: "Bengaluru Karnataka"
    },

    {
        name: "Mysuru",
        state: "karnataka",
        description: "A royal city famous for palaces, heritage and traditional culture.",
        rating: 4.8,
        category: "Heritage",
        imageQuery: "Mysore Karnataka"
    },

    {
        name: "Hampi",
        state: "karnataka",
        description: "An extraordinary archaeological landscape filled with Vijayanagara ruins.",
        rating: 4.9,
        category: "Heritage",
        imageQuery: "Hampi Karnataka"
    },

    {
        name: "Coorg",
        state: "karnataka",
        description: "A lush hill region known for coffee plantations, forests and waterfalls.",
        rating: 4.7,
        category: "Nature",
        imageQuery: "Coorg Karnataka"
    },

    {
        name: "Gokarna",
        state: "karnataka",
        description: "A coastal destination combining beautiful beaches with spiritual heritage.",
        rating: 4.6,
        category: "Nature",
        imageQuery: "Gokarna Karnataka"
    },

    {
        name: "Badami",
        state: "karnataka",
        description: "A historic destination famous for its rock-cut cave temples and sandstone cliffs.",
        rating: 4.7,
        category: "Heritage",
        imageQuery: "Badami Karnataka"
    },


    // ==================== ANDHRA PRADESH ====================

    {
        name: "Visakhapatnam",
        state: "andhraPradesh",
        description: "A coastal city known for beaches, hills and scenic sea views.",
        rating: 4.7,
        category: "Nature",
        imageQuery: "Visakhapatnam Andhra Pradesh"
    },

    {
        name: "Tirupati",
        state: "andhraPradesh",
        description: "One of India's most important pilgrimage destinations.",
        rating: 4.8,
        category: "Spirituality",
        imageQuery: "Tirupati Andhra Pradesh"
    },

    {
        name: "Araku Valley",
        state: "andhraPradesh",
        description: "A beautiful valley surrounded by mountains, forests and coffee plantations.",
        rating: 4.8,
        category: "Nature",
        imageQuery: "Araku Valley Andhra Pradesh"
    },

    {
        name: "Amaravati",
        state: "andhraPradesh",
        description: "A historic region associated with Buddhist heritage and ancient traditions.",
        rating: 4.5,
        category: "Heritage",
        imageQuery: "Amaravati Andhra Pradesh"
    },

    {
        name: "Lepakshi",
        state: "andhraPradesh",
        description: "A heritage destination famous for its temple architecture and intricate sculptures.",
        rating: 4.7,
        category: "Heritage",
        imageQuery: "Lepakshi Andhra Pradesh"
    },

    {
        name: "Vijayawada",
        state: "andhraPradesh",
        description: "A major cultural destination situated along the Krishna River.",
        rating: 4.5,
        category: "Culture",
        imageQuery: "Vijayawada Andhra Pradesh"
    },


    // ==================== GOA ====================

    {
        name: "Panaji",
        state: "goa",
        description: "A charming riverside capital known for colourful streets and Portuguese heritage.",
        rating: 4.6,
        category: "Heritage",
        imageQuery: "Panaji Goa"
    },

    {
        name: "Baga Beach",
        state: "goa",
        description: "A lively beach destination known for its coastline and vibrant atmosphere.",
        rating: 4.5,
        category: "Nature",
        imageQuery: "Baga Beach Goa"
    },

    {
        name: "Old Goa",
        state: "goa",
        description: "A historic area filled with remarkable Portuguese-era churches and monuments.",
        rating: 4.8,
        category: "Heritage",
        imageQuery: "Old Goa Churches"
    },

    {
        name: "Dudhsagar Falls",
        state: "goa",
        description: "A spectacular waterfall surrounded by forests in the Western Ghats.",
        rating: 4.8,
        category: "Adventure",
        imageQuery: "Dudhsagar Falls Goa"
    },

    {
        name: "Palolem Beach",
        state: "goa",
        description: "A picturesque southern beach known for its calm waters and scenic surroundings.",
        rating: 4.7,
        category: "Nature",
        imageQuery: "Palolem Beach Goa"
    },

    {
        name: "Fort Aguada",
        state: "goa",
        description: "A historic coastal fort offering panoramic views of the Arabian Sea.",
        rating: 4.7,
        category: "Heritage",
        imageQuery: "Fort Aguada Goa"
    },


    // ==================== MAHARASHTRA ====================

    {
        name: "Mumbai",
        state: "maharashtra",
        description: "India's energetic financial capital with iconic landmarks and coastal views.",
        rating: 4.7,
        category: "Culture",
        imageQuery: "Mumbai Maharashtra"
    },

    {
        name: "Ajanta Caves",
        state: "maharashtra",
        description: "Ancient rock-cut caves famous for Buddhist paintings and sculptures.",
        rating: 4.9,
        category: "Heritage",
        imageQuery: "Ajanta Caves Maharashtra"
    },

    {
        name: "Ellora Caves",
        state: "maharashtra",
        description: "A remarkable complex of rock-cut temples representing multiple religious traditions.",
        rating: 4.9,
        category: "Heritage",
        imageQuery: "Ellora Caves Maharashtra"
    },

    {
        name: "Mahabaleshwar",
        state: "maharashtra",
        description: "A scenic hill station known for viewpoints, forests and strawberry farms.",
        rating: 4.6,
        category: "Nature",
        imageQuery: "Mahabaleshwar Maharashtra"
    },

    {
        name: "Lonavala",
        state: "maharashtra",
        description: "A popular hill destination surrounded by green valleys, waterfalls and forts.",
        rating: 4.6,
        category: "Nature",
        imageQuery: "Lonavala Maharashtra"
    },

    {
        name: "Raigad Fort",
        state: "maharashtra",
        description: "A historic hill fort strongly associated with the Maratha Empire.",
        rating: 4.8,
        category: "Heritage",
        imageQuery: "Raigad Fort Maharashtra"
    },


    // ==================== GUJARAT ====================

    {
        name: "Ahmedabad",
        state: "gujarat",
        description: "A historic city blending old-world architecture, culture and modern life.",
        rating: 4.6,
        category: "Heritage",
        imageQuery: "Ahmedabad Gujarat"
    },

    {
        name: "Rann of Kutch",
        state: "gujarat",
        description: "A spectacular white salt desert known for its unique landscapes and festivals.",
        rating: 4.8,
        category: "Nature",
        imageQuery: "Rann of Kutch Gujarat"
    },

    {
        name: "Somnath",
        state: "gujarat",
        description: "A sacred coastal destination centred around the historic Somnath Temple.",
        rating: 4.8,
        category: "Spirituality",
        imageQuery: "Somnath Gujarat"
    },

    {
        name: "Dwarka",
        state: "gujarat",
        description: "An important pilgrimage destination associated with ancient Hindu traditions.",
        rating: 4.8,
        category: "Spirituality",
        imageQuery: "Dwarka Gujarat"
    },

    {
        name: "Gir National Park",
        state: "gujarat",
        description: "A renowned wildlife destination and important habitat of the Asiatic lion.",
        rating: 4.8,
        category: "Adventure",
        imageQuery: "Gir National Park Gujarat"
    },

    {
        name: "Statue of Unity",
        state: "gujarat",
        description: "A major landmark surrounded by gardens, viewpoints and visitor attractions.",
        rating: 4.7,
        category: "Culture",
        imageQuery: "Statue of Unity Gujarat"
    },


    // ==================== RAJASTHAN ====================

    {
        name: "Jaipur",
        state: "rajasthan",
        description: "The Pink City, famous for grand palaces, forts and colourful markets.",
        rating: 4.8,
        category: "Heritage",
        imageQuery: "Jaipur Rajasthan"
    },

    {
        name: "Udaipur",
        state: "rajasthan",
        description: "A romantic lake city surrounded by palaces, hills and historic architecture.",
        rating: 4.8,
        category: "Heritage",
        imageQuery: "Udaipur Rajasthan"
    },

    {
        name: "Jaisalmer",
        state: "rajasthan",
        description: "A golden desert city famous for its fort, havelis and desert experiences.",
        rating: 4.8,
        category: "Adventure",
        imageQuery: "Jaisalmer Rajasthan"
    },

    {
        name: "Jodhpur",
        state: "rajasthan",
        description: "The Blue City dominated by the magnificent Mehrangarh Fort.",
        rating: 4.7,
        category: "Heritage",
        imageQuery: "Jodhpur Rajasthan"
    },

    {
        name: "Pushkar",
        state: "rajasthan",
        description: "A colourful pilgrimage town centred around its sacred lake and temples.",
        rating: 4.6,
        category: "Spirituality",
        imageQuery: "Pushkar Rajasthan"
    },

    {
        name: "Ranthambore",
        state: "rajasthan",
        description: "A famous wildlife destination known for forests, ruins and tiger sightings.",
        rating: 4.7,
        category: "Adventure",
        imageQuery: "Ranthambore Rajasthan"
    },


    // ==================== UTTAR PRADESH ====================

    {
        name: "Agra",
        state: "uttarPradesh",
        description: "Home to the Taj Mahal and one of India's most celebrated heritage landscapes.",
        rating: 4.9,
        category: "Heritage",
        imageQuery: "Taj Mahal Agra"
    },

    {
        name: "Varanasi",
        state: "uttarPradesh",
        description: "One of India's oldest cities, known for its ghats, temples and spiritual traditions.",
        rating: 4.8,
        category: "Spirituality",
        imageQuery: "Varanasi Uttar Pradesh"
    },

    {
        name: "Lucknow",
        state: "uttarPradesh",
        description: "A historic city renowned for Nawabi architecture, culture and cuisine.",
        rating: 4.6,
        category: "Culture",
        imageQuery: "Lucknow Uttar Pradesh"
    },

    {
        name: "Ayodhya",
        state: "uttarPradesh",
        description: "An important spiritual destination associated with ancient Indian traditions.",
        rating: 4.7,
        category: "Spirituality",
        imageQuery: "Ayodhya Uttar Pradesh"
    },

    {
        name: "Mathura",
        state: "uttarPradesh",
        description: "A historic pilgrimage destination deeply connected with Krishna traditions.",
        rating: 4.7,
        category: "Spirituality",
        imageQuery: "Mathura Uttar Pradesh"
    },

    {
        name: "Prayagraj",
        state: "uttarPradesh",
        description: "A historic city at the meeting point of the Ganga, Yamuna and mythical Saraswati.",
        rating: 4.5,
        category: "Culture",
        imageQuery: "Prayagraj Uttar Pradesh"
    }

];