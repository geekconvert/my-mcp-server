# MCP City State Resolver Server

A Model Context Protocol (MCP) server that provides state information for Indian cities using StreamableHTTP transport.

## Features

- 🌍 **City to State Mapping**: Get state names for Indian cities
- 🚀 **HTTP Transport**: Uses StreamableHTTP for communication
- 🧪 **Comprehensive Testing**: Includes automated test suite
- 📋 **Management Scripts**: Easy server management

## Supported Cities

The server currently supports the following cities:

- **Kanpur** → Uttar Pradesh
- **Delhi** → Delhi
- **Mumbai** → Maharashtra
- **Bangalore** → Karnataka
- **Chennai** → Tamil Nadu
- **Kolkata** → West Bengal
- **Hyderabad** → Telangana
- **Pune** → Maharashtra
- **Jaipur** → Rajasthan
- **Lucknow** → Uttar Pradesh

## Files Structure

```
├── simple-mcp-server.mjs    # Main MCP server implementation
├── server.mjs               # Alternative StreamableHTTP implementation
├── test-mcp.mjs            # Test suite for the MCP server
├── manage-server.sh        # Server management script
├── package.json            # Node.js dependencies
└── .vscode/mcp.json       # VS Code MCP configuration
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
./manage-server.sh start
```

## Usage

### Using the Management Script

```bash
# Start the server
./manage-server.sh start

# Check server status
./manage-server.sh status

# Test the server
./manage-server.sh test

# View logs
./manage-server.sh logs

# Stop the server
./manage-server.sh stop

# Restart the server
./manage-server.sh restart
```

### Manual Testing

The server runs on `http://localhost:3001/mcp` and follows the MCP protocol.

## Tool Details

### getStateByCityName

**Description**: Get the state name for a given city in India

**Parameters**:

- `city` (string, required): The name of the city

**Response**:

```json
{
  "city": "Kanpur",
  "state": "Uttar Pradesh",
  "found": true
}
```

## VS Code Integration

The server is configured for VS Code MCP integration in `.vscode/mcp.json`:

```json
{
  "servers": {
    "statename": {
      "type": "http",
      "url": "http://localhost:3001/mcp"
    }
  }
}
```

## Testing Results

✅ **Server Initialization**: Successfully initializes with MCP protocol  
✅ **Tool Discovery**: Lists available tools correctly  
✅ **City Lookup**: Returns correct state for known cities  
✅ **Unknown Cities**: Handles unknown cities gracefully  
✅ **Error Handling**: Proper error responses for invalid requests

above is the json to connect this mcp server with vscode using stdin/stdout.
