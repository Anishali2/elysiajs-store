import { Elysia } from "elysia";
import { demoRoutes } from "./routes/demo";

const app = new Elysia()
  // Home route
  .get("/", () => ({
    message: "Welcome to Drizzle API",
    endpoints: {
      getAllAccounts: "GET /accounts",
      demoGet: "GET /demo",
      demoPost: "POST /demo",
    },
  }))
  
  // Register demo routes
  .use(demoRoutes)

  // Get all accounts
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
console.log("\nAvailable endpoints:");
console.log("  GET http://localhost:3000/");
console.log("  GET http://localhost:3000/accounts");
