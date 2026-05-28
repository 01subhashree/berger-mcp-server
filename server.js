import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import bergerData from "./data.json" with { type: "json" };
import comparisonData from "./comparison.json" with { type: "json" };

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

server.registerTool(
  "get-product-types",
  {
    title: "Get Product Types",
    description: "Returns all waterproofing product types",
    inputSchema: {},
  },
  async () => {
    const uniqueTypes = [
      ...new Set(comparisonData.products.map((item) => item.type)),
    ];

    return {
      content: [
        {
          type: "text",
          text: uniqueTypes.join("\n"),
        },
      ],
    };
  },
);

server.registerTool(
  "search-products",
  {
    title: "Search Products",
    description: "Search Berger waterproofing products",
    inputSchema: {
      keyword: z.string(),
    },
  },
  async ({ keyword }) => {
    const results = comparisonData.products.filter((item) =>
      item.berger_product.toLowerCase().includes(keyword.toLowerCase()),
    );

    if (results.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No matching products found",
          },
        ],
      };
    }

    const formatted = results
      .map(
        (item) => `
${item.berger_product}
Type: ${item.type}
`,
      )
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text: formatted,
        },
      ],
    };
  },
);

server.registerTool(
  "get-product-alternatives",
  {
    title: "Get Product Alternatives",
    description: "Get competitor alternatives for Berger products",
    inputSchema: {
      product: z.string(),
    },
  },
  async ({ product }) => {
    const foundProduct = comparisonData.products.find(
      (item) => item.berger_product.toLowerCase() === product.toLowerCase(),
    );

    if (!foundProduct) {
      return {
        content: [
          {
            type: "text",
            text: "Product not found",
          },
        ],
      };
    }

    const competitorText = Object.entries(foundProduct.competitors)
      .map(([brand, products]) => {
        return `
${brand.replaceAll("_", "")}:
${products.join("\n")}
`;
      })
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text: `
Berger Product: ${foundProduct.berger_product}

Type: ${foundProduct.type}

Competitor Alternatives:
${competitorText}
          `,
        },
      ],
    };
  },
);

server.registerTool(
  "get-products-by-category",
  {
    title: "Get Products By Category",
    description: "Get Berger waterproofing products by category",
    inputSchema: {
      category: z.string(),
    },
  },
  async ({ category }) => {
    const categories = comparisonData.waterproofing_categories;

    const foundCategory = Object.keys(categories).find(
      (item) => item.toLowerCase() === category.toLowerCase(),
    );

    if (!foundCategory) {
      return {
        content: [
          {
            type: "text",
            text: "Category not found",
          },
        ],
      };
    }

    const products = categories[foundCategory];

    return {
      content: [
        {
          type: "text",
          text: products.join("\n"),
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
