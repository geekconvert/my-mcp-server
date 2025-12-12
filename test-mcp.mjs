#!/usr/bin/env node

// test-mcp.mjs
const BASE_URL = "http://localhost:3001/mcp";

async function makeRequest(data) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify(data),
  });

  // Handle 204 No Content responses
  if (response.status === 204) {
    return { status: "success" };
  }

  return await response.json();
}

async function testMCPServer() {
  try {
    console.log("🧪 Testing MCP Server...\n");

    // Step 1: Initialize
    console.log("1. Initializing server...");
    const initResult = await makeRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        clientInfo: { name: "test-client", version: "1.0.0" },
      },
    });
    console.log("✅ Initialize result:", JSON.stringify(initResult, null, 2));

    // Step 2: Send initialized notification
    console.log("\n2. Sending initialized notification...");
    const initNotification = await makeRequest({
      jsonrpc: "2.0",
      method: "initialized",
    });
    console.log("✅ Initialized notification sent");

    // Step 3: List tools
    console.log("\n3. Listing tools...");
    const toolsResult = await makeRequest({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
    });
    console.log("✅ Tools list:", JSON.stringify(toolsResult, null, 2));

    // Step 4: Test getStateByCityName with Kanpur
    console.log('\n4. Testing getStateByCityName with "Kanpur"...');
    const kanpurResult = await makeRequest({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "getStateByCityName",
        arguments: { city: "Kanpur" },
      },
    });
    console.log("✅ Kanpur result:", JSON.stringify(kanpurResult, null, 2));

    // Step 5: Test with Delhi
    console.log('\n5. Testing getStateByCityName with "Delhi"...');
    const delhiResult = await makeRequest({
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "getStateByCityName",
        arguments: { city: "Delhi" },
      },
    });
    console.log("✅ Delhi result:", JSON.stringify(delhiResult, null, 2));

    // Step 6: Test with unknown city
    console.log('\n6. Testing getStateByCityName with "Unknown City"...');
    const unknownResult = await makeRequest({
      jsonrpc: "2.0",
      id: 5,
      method: "tools/call",
      params: {
        name: "getStateByCityName",
        arguments: { city: "Unknown City" },
      },
    });
    console.log(
      "✅ Unknown city result:",
      JSON.stringify(unknownResult, null, 2)
    );

    console.log("\n🎉 All tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testMCPServer();
