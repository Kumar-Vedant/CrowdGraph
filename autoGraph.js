const axios = require("axios");

// --- Configuration ---
const API_ENDPOINT = "https://crowdgraph.onrender.com/edge/create"; // 🎯 Your Node Backend API URL
const REQUEST_TIMEOUT_MS = 60000; // ⏱️ Set timeout to 30 seconds

const parametersToCall = [
  {
    sourceId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:28",
    targetId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:40",
    type: "Compatible_With",
    properties: {
      communityId: "35265f7c-0b11-4b7b-b06c-5ba1af9a3b23",
    },
  },
  {
    sourceId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:29",
    targetId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:40",
    type: "Compatible_With",
    properties: {
      communityId: "35265f7c-0b11-4b7b-b06c-5ba1af9a3b23",
    },
  },
  {
    sourceId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:30",
    targetId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:41",
    type: "Compatible_With",
    properties: {
      communityId: "35265f7c-0b11-4b7b-b06c-5ba1af9a3b23",
    },
  },
  {
    sourceId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:31",
    targetId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:41",
    type: "Uses_Socket",
    properties: {
      socket: "LGA1700",
      communityId: "35265f7c-0b11-4b7b-b06c-5ba1af9a3b23",
    },
  },
  {
    sourceId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:33",
    targetId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:41",
    type: "Uses_Socket",
    properties: {
      socket: "LGA1700",
      communityId: "35265f7c-0b11-4b7b-b06c-5ba1af9a3b23",
    },
  },
  {
    sourceId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:32",
    targetId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:40",
    type: "Uses_Socket",
    properties: {
      socket: "AM5",
      communityId: "35265f7c-0b11-4b7b-b06c-5ba1af9a3b23",
    },
  },
  {
    sourceId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:37",
    targetId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:40",
    type: "Connects_Via",
    properties: {
      interface: "PCIe 4.0",
      communityId: "35265f7c-0b11-4b7b-b06c-5ba1af9a3b23",
    },
  },
  {
    sourceId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:38",
    targetId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:41",
    type: "Supports_RAM_Type",
    properties: {
      memoryType: "DDR5",
      communityId: "35265f7c-0b11-4b7b-b06c-5ba1af9a3b23",
    },
  },
  {
    sourceId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:38",
    targetId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:40",
    type: "Supports_RAM_Type",
    properties: {
      memoryType: "DDR5",
      communityId: "35265f7c-0b11-4b7b-b06c-5ba1af9a3b23",
    },
  },
  {
    sourceId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:42",
    targetId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:30",
    type: "Uses_GPU",
    properties: {
      communityId: "35265f7c-0b11-4b7b-b06c-5ba1af9a3b23",
    },
  },
  {
    sourceId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:43",
    targetId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:28",
    type: "Alternative_To",
    properties: {
      reason: "High-end performance comparison",
      communityId: "35265f7c-0b11-4b7b-b06c-5ba1af9a3b23",
    },
  },
  {
    sourceId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:34",
    targetId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:43",
    type: "Performance_Compared_With",
    properties: {
      metric: "CPU/GPU benchmarks",
      communityId: "35265f7c-0b11-4b7b-b06c-5ba1af9a3b23",
    },
  },
  {
    sourceId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:36",
    targetId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:35",
    type: "Competitor_Device",
    properties: {
      communityId: "35265f7c-0b11-4b7b-b06c-5ba1af9a3b23",
    },
  },
  {
    sourceId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:35",
    targetId: "4:8eefa8fc-22bf-4992-b648-f9c4e4c8cc01:34",
    type: "Competitor_Device",
    properties: {
      communityId: "35265f7c-0b11-4b7b-b06c-5ba1af9a3b23",
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
