import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { demoRoutes } from "./routes/demo";
import { categoriesApiRoutes } from "./routes/categories-api";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .use(cors())
  .get("/", () => ({
    message: "Store Management API",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
      categories: "/api/categories",
      demoGet: "/demo",
      demoPost: "/demo",
    },
  }))
  .use(demoRoutes)
  .use(categoriesApiRoutes)
  .listen(port);

console.log(
  `🦊 Elysia Store Management API is running at ${app.server?.hostname}:${app.server?.port}`,
);
