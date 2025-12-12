// simple-mcp-server.mjs
import express from "express";
import cors from "cors";

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
    lucknow: "Uttar Pradesh",
  };

  const state = cityStateMap[city.toLowerCase()];
  return {
    city: city,
    state: state || "Unknown",
    found: !!state,
  };
}

const app = express();
app.use(cors());
app.use(express.json());

let initialized = false;

app.post("/mcp", async (req, res) => {
  const { jsonrpc, id, method, params } = req.body;

  console.log(`[${new Date().toISOString()}] MCP Request: ${method}`);

  try {
    if (method === "initialize") {
      initialized = true;
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: { listChanged: true },
          },
          serverInfo: {
            name: "City State Resolver",
            version: "1.0.0",
          },
        },
      });
    }

    if (method === "initialized") {
      // Just acknowledge the notification
      return res.status(204).send();
    }

    if (!initialized) {
      return res.json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Server not initialized",
        },
        id,
      });
    }

    if (method === "tools/list") {
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          tools: [
            {
              name: "getStateByCityName",
              description: "Get the state name for a given city in India",
              inputSchema: {
                type: "object",
                properties: {
                  city: {
                    type: "string",
                    description: "The name of the city",
                  },
                },
                required: ["city"],
              },
            },
          ],
        },
      });
    }

    if (method === "tools/call") {
      const { name, arguments: args } = params;

      if (name === "getStateByCityName") {
        const data = await getStateNameForCity(args.city);
        return res.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(data),
              },
            ],
          },
        });
      }

      return res.json({
        jsonrpc: "2.0",
        error: {
          code: -32601,
          message: `Unknown tool: ${name}`,
        },
        id,
      });
    }

    return res.json({
      jsonrpc: "2.0",
      error: {
        code: -32601,
        message: `Method not found: ${method}`,
      },
      id,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: error.message,
      },
      id,
    });
  }
});

app.get("/", (_req, res) => {
  res.send("Simple MCP server is running. Use /mcp endpoint for MCP requests.");
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(PORT, () => {
  console.log(`🚀 Simple MCP server running on http://localhost:${PORT}/mcp`);
  console.log(`📋 Tool: getStateByCityName`);
});
