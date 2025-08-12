import { Elysia } from "elysia";
import { getAllAccounts } from "./api";

const app = new Elysia()
  // Home route
  .get("/", () => ({
    message: "Welcome to Drizzle API",
    endpoints: {
      getAllAccounts: "GET /accounts",
    },
  }))

  // Get all accounts
  .get("/accounts", async () => {
    try {
      const accounts = await getAllAccounts();
      return {
        success: true,
        count: accounts.length,
        data: accounts,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
console.log("\nAvailable endpoints:");
console.log("  GET http://localhost:3000/");
console.log("  GET http://localhost:3000/accounts");

