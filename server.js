import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import bergerData from "./data.json" with { type: "json" };

// Create MCP Server
const server = new McpServer({
  name: "berger-server",
  version: "1.0.0",
});

// Get competitors
server.registerTool(
  "get-competitors",
  {
    title: "Get Competitors",
    description: "Returns Berger competitors",
    inputSchema: {},
  },
  async () => {
    const competitors = bergerData.competitors
      .map((item) => item.name)
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text: competitors,
        },
      ],
    };
  },
);

// Get similar products
server.registerTool(
  "get-similar-products",
  {
    title: "Get Similar Products",
    description: "Get similar competitor products",
    inputSchema: {
      competitor: z.string(),
    },
  },
  async ({ competitor }) => {
    const found = bergerData.competitors.find(
      (item) => item.name.toLowerCase() === competitor.toLowerCase(),
    );

    if (!found) {
      return {
        content: [
          {
            type: "text",
            text: "Competitor not found",
          },
        ],
      };
    }

    const result = found.similar_products
      .map(
        (item) =>
          `Berger Product: ${item.berger_product}
           Competitor Product: ${item.competitor_product}
           Category: ${item.category}`,
      )
      .join("\n\n");

    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  },
);

// Start server
async function main() {
  const transport = new StdioServerTransport();

  await server.connect(transport);

  console.error("Berger MCP Server Running...");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
