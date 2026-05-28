# Berger MCP Server

MCP server for Berger Paints competitor intelligence.

## Features

* Get competitors
* Compare products
* Fetch competitor strengths

## Install

```bash
npm install
```

## Run

```bash
node server.js
```

## Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector node server.js
```

## Claude Desktop Config

```json
{
  "mcpServers": {
    "berger-server": {
      "command": "/opt/homebrew/bin/node",
      "args": [
        "/absolute/path/to/server.js"
      ]
    }
  }
}
```

## Example Prompts

* Get competitors
* Get similar products for Asian Paints
* Get competitor strengths for Birla Opus
