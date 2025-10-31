import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

async function getWeatherByCity(city) {
  if (city.toLowerCase() === "patiala") {
    return {
      temperature: "15C",
      forecast: "Chances of high rainfall",
    };
  }
  if (city.toLowerCase() === "delhi") {
    return {
      temperature: "40C",
      error: "Chances of high wind",
    };
  }
  return {
    temperature: null,
    forecast: "Unable to get weather data",
  };
}

const server = new McpServer({
  name: "Weather Data Fetcher",
  version: "1.0.0",
});

server.tool(
  "getWeatherDataByCityName",
  { city: z.string() },
  async ({ city }) => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(await getWeatherByCity(city)),
        },
      ],
    };
  }
);

async function init() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
init();
