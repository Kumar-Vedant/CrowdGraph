const axios = require("axios");

// --- Configuration ---
const API_ENDPOINT = "https://crowdgraph.onrender.com/node/create"; // 🎯 Your Node Backend API URL
const REQUEST_TIMEOUT_MS = 60000; // ⏱️ Set timeout to 30 seconds

const parametersToCall = [
  {
    labels: ["Game"],
    properties: {
      name: "Titanfall 2",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      releaseYear: 2016,
      genre: "FPS, Sci-Fi",
      engine: "Source Engine",
      developer: "Respawn Entertainment",
    },
  },
  {
    labels: ["Game"],
    properties: {
      name: "Crysis 3",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      releaseYear: 2013,
      genre: "FPS",
      engine: "CryEngine 3",
      developer: "Crytek",
    },
  },
  {
    labels: ["Game"],
    properties: {
      name: "Ghostrunner",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      releaseYear: 2020,
      genre: "Cyberpunk, Parkour, Action",
      engine: "Unreal Engine 4",
      developer: "One More Level",
    },
  },
  {
    labels: ["Game"],
    properties: {
      name: "God of War (2018)",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      releaseYear: 2018,
      genre: "Action, Adventure",
      engine: "Santa Monica Engine",
      developer: "Santa Monica Studio",
    },
  },
  {
    labels: ["Game"],
    properties: {
      name: "God of War III",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      releaseYear: 2010,
      genre: "Action, Hack and Slash",
      engine: "Kinetica Engine",
      developer: "Santa Monica Studio",
    },
  },
  {
    labels: ["Game"],
    properties: {
      name: "Apex Legends",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      releaseYear: 2019,
      genre: "Battle Royale, FPS",
      engine: "Source Engine",
      developer: "Respawn Entertainment",
    },
  },
  {
    labels: ["Game"],
    properties: {
      name: "Doom Eternal",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      releaseYear: 2020,
      genre: "FPS",
      engine: "id Tech 7",
      developer: "id Software",
    },
  },
  {
    labels: ["Game"],
    properties: {
      name: "The Witcher 3: Wild Hunt",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      releaseYear: 2015,
      genre: "RPG",
      engine: "REDengine 3",
      developer: "CD Projekt Red",
    },
  },
  {
    labels: ["Game"],
    properties: {
      name: "Cyberpunk 2077",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      releaseYear: 2020,
      genre: "RPG",
      engine: "REDengine 4",
      developer: "CD Projekt Red",
    },
  },
  {
    labels: ["Game"],
    properties: {
      name: "Halo Infinite",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      releaseYear: 2021,
      genre: "FPS",
      engine: "Slipspace Engine",
      developer: "343 Industries",
    },
  },

  //----------------------------------------------------------------------
  // Developers
  //----------------------------------------------------------------------
  {
    labels: ["Developer"],
    properties: {
      name: "Respawn Entertainment",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      founded: 2010,
      country: "USA",
      notableGames: ["Titanfall", "Titanfall 2", "Apex Legends"],
    },
  },
  {
    labels: ["Developer"],
    properties: {
      name: "Crytek",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      founded: 1999,
      country: "Germany",
      notableGames: ["Crysis Series", "Ryse: Son of Rome"],
    },
  },
  {
    labels: ["Developer"],
    properties: {
      name: "CD Projekt Red",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      founded: 2002,
      country: "Poland",
      notableGames: ["The Witcher Series", "Cyberpunk 2077"],
    },
  },
  {
    labels: ["Developer"],
    properties: {
      name: "Santa Monica Studio",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      founded: 1999,
      country: "USA",
      notableGames: ["God of War Series"],
    },
  },
  {
    labels: ["Developer"],
    properties: {
      name: "One More Level",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      country: "Poland",
      notableGames: ["Ghostrunner"],
    },
  },

  //----------------------------------------------------------------------
  // Game Engines
  //----------------------------------------------------------------------
  {
    labels: ["Engine"],
    properties: {
      name: "Source Engine",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      createdBy: "Valve",
      initialRelease: 2004,
    },
  },
  {
    labels: ["Engine"],
    properties: {
      name: "CryEngine 3",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      createdBy: "Crytek",
      initialRelease: 2009,
    },
  },
  {
    labels: ["Engine"],
    properties: {
      name: "Unreal Engine 4",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      createdBy: "Epic Games",
      initialRelease: 2014,
    },
  },
  {
    labels: ["Engine"],
    properties: {
      name: "REDengine 3",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      createdBy: "CD Projekt Red",
      initialRelease: 2013,
    },
  },
  {
    labels: ["Engine"],
    properties: {
      name: "REDengine 4",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      createdBy: "CD Projekt Red",
      initialRelease: 2020,
    },
  },
  {
    labels: ["Engine"],
    properties: {
      name: "id Tech 7",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      createdBy: "id Software",
      initialRelease: 2020,
    },
  },
  {
    labels: ["Engine"],
    properties: {
      name: "Slipspace Engine",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      createdBy: "343 Industries",
      initialRelease: 2019,
    },
  },

  //----------------------------------------------------------------------
  // Characters
  //----------------------------------------------------------------------
  {
    labels: ["Character"],
    properties: {
      name: "Jack Cooper",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      appearsIn: "Titanfall 2",
      role: "Pilot",
    },
  },
  {
    labels: ["Character"],
    properties: {
      name: "BT-7274",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      appearsIn: "Titanfall 2",
      role: "Vanguard-Class Titan",
    },
  },
  {
    labels: ["Character"],
    properties: {
      name: "Kratos",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      appearsIn: ["God of War III", "God of War (2018)"],
      role: "Protagonist",
    },
  },
  {
    labels: ["Character"],
    properties: {
      name: "Atreus",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      appearsIn: "God of War (2018)",
      role: "Deuteragonist",
    },
  },
  {
    labels: ["Character"],
    properties: {
      name: "Geralt of Rivia",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      appearsIn: "The Witcher 3",
      role: "Protagonist",
    },
  },

  //----------------------------------------------------------------------
  // Platforms
  //----------------------------------------------------------------------
  {
    labels: ["Platform"],
    properties: {
      name: "PlayStation 4",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      manufacturer: "Sony",
      releaseYear: 2013,
    },
  },
  {
    labels: ["Platform"],
    properties: {
      name: "Xbox One",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      manufacturer: "Microsoft",
      releaseYear: 2013,
    },
  },
  {
    labels: ["Platform"],
    properties: {
      name: "PC",
      communityId: "18bda686-6138-48a6-8036-07f6e75fcb17",
      manufacturer: "Various",
      releaseYear: null,
    },
  },
];
// ---------------------

/**
 * Executes a series of API calls sequentially using Axios.
 */
async function runSequentialApiCalls() {
  console.log(`Starting sequential calls to ${API_ENDPOINT}...`);
  console.log(`Total calls to make: ${parametersToCall.length}\n`);

  // Use for...of loop to ensure sequential execution
  for (const params of parametersToCall) {
    console.log(`-- Starting call for parameters: id=${params.id}, name=${params.name}`);

    try {
      // 1. Make the API Call and AWAIT the response
      // Axios automatically serializes 'params' into a JSON request body
      const response = await axios.post(API_ENDPOINT, params, {
        headers: {
          "Content-Type": "application/json",
          // Add any other necessary headers (e.g., Authorization)
        },
        timeout: REQUEST_TIMEOUT_MS,
      });

      // 2. Axios automatically rejects on non-2xx status, so if we reach here, it was a success.
      // The response data is conveniently located at 'response.data'.
      const result = response.data;

      // 3. Log Success and the Result
      console.log(`   ✅ Call for id=${params.id} finished successfully! Status: ${response.status}`);
      // console.log('   Response Data:', result); // Uncomment to see the full response data
    } catch (error) {
      // 4. Handle Errors
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          // Handle timeout error
          console.error(`   ❌ Call for id=${params.id} failed: Request Timed Out after ${REQUEST_TIMEOUT_MS / 1000}s!`);
        } else if (error.response) {
          // Handle HTTP errors (4xx or 5xx)
          console.error(`   ❌ Call for id=${params.id} failed with status ${error.response.status}. Message: ${error.message}`);
          // console.error('   Server Error Details:', error.response.data); // Uncomment to see server error body
        } else {
          // Handle network or request setup errors
          console.error(`   ❌ Call for id=${params.id} failed: Network or configuration error.`, error.message);
        }
      } else {
        // Handle non-Axios errors (e.g., programming mistakes)
        console.error(`   ❌ An unexpected error occurred for id=${params.id}:`, error.message);
      }

      // Decide if a failure should stop the entire process
      // return; // Uncomment this line to stop on the first failure
    }
    console.log(""); // Add a blank line for readability between calls
  }

  console.log("--- All sequential calls completed. ---");
}

// Execute the main function
runSequentialApiCalls();
