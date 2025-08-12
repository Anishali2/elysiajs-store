import { Elysia, t } from "elysia";

export const demoRoutes = new Elysia({ prefix: "/demo" })
  .get("/", () => ({
    message: "Demo GET endpoint working!",
    timestamp: new Date().toISOString(),
    data: {
      users: [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" }
      ]
    }
  }))
  
  .post("/", ({ body }) => ({
    message: "Demo POST endpoint working!",
    timestamp: new Date().toISOString(),
    received: body,
    status: "success"
  }), {
    body: t.Object({
      name: t.String(),
      email: t.Optional(t.String()),
      data: t.Optional(t.Any())
    })
  });