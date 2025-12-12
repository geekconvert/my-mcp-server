// server.mjs
import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

async function getStateNameForCity(city) {
  const cityStateMap = {
    kanpur: "Uttar Pradesh",
    delhi: "Delhi",
    mumbai: "Maharashtra",
    bangalore: "Karnataka",
    chennai: "Tamil Nadu",
    kolkata: "West Bengal",
    hyderabad: "Telangana",
    pune: "Maharashtra",
    jaipur: "Rajasthan",
    agra: "Uttar Pradesh",
    lucknow: "Uttar Pradesh",
  };

  const state = cityStateMap[city.toLowerCase()];
  return {
    city: city,
    state: state || "Unknown",
    found: !!state,
  };
}

const server = new McpServer({
  name: "City State Resolver",
  version: "1.0.0",
});

server.tool("getStateByCityName", { city: z.string() }, async ({ city }) => {
  const data = await getStateNameForCity(city);
  return {
    content: [{ type: "text", text: JSON.stringify(data) }],
    structuredContent: data,
  };
});

const app = express();
app.disable("x-powered-by");
app.use(
  cors({ origin: true, credentials: true, exposedHeaders: ["Mcp-Session-Id"] })
);
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.all("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
    enableJsonResponse: true,
  });

  res.on("close", () => transport.close());

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (e) {
    console.error("Transport error:", e);
    if (!res.headersSent) res.status(500).json({ error: "internal_error" });
  }
});

app.options("/mcp", cors());

app.get("/", (_req, res) =>
  res.send("MCP Streamable HTTP server is running. Use /mcp endpoint.")
);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`🚀 MCP server running on http://localhost:${PORT}/mcp`);
  console.log(`📋 Tool: getStateByCityName`);
});
