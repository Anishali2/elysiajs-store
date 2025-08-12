import { Elysia, t } from "elysia";
import { db } from "../drizzle/db";
import { categories, NewCategoriesSchema } from "../drizzle/schema/categories";
import { eq } from "drizzle-orm";

export const categoriesApiRoutes = new Elysia({ prefix: "/api/categories" })
  .get("/", async () => {
    try {
      const allCategories = await db
        .select()
        .from(categories)
        .where(eq(categories.deleted, false))
        .orderBy(categories.name);

      const parentCategories = allCategories.filter((cat) => cat.parent === null);
      const subcategories = allCategories.filter((cat) => cat.parent !== null);

      const categoriesWithChildren = parentCategories.map((parent) => ({
        ...parent,
        children: subcategories.filter((sub) => sub.parent === parent.id) ?? [],
      }));

      return {
        success: true,
        data: {
          allCategories: allCategories,
          categories: categoriesWithChildren,
          total: allCategories.length,
        },
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return {
        success: false,
        message: "Failed to fetch categories",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  })
  
  .post("/", async ({ body }) => {
    try {
      const validatedData = NewCategoriesSchema.parse(body);
      
      const result = await db
        .insert(categories)
        .values(validatedData)
        .returning({
          id: categories.id,
          name: categories.name,
          parent: categories.parent,
          description: categories.description,
          createdAt: categories.createdAt,
        });

      return {
        success: true,
        message: "Category created successfully",
        data: result[0],
      };
    } catch (error) {
      console.error("Error creating category:", error);
      return {
        success: false,
        message: "Failed to create category",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }, {
    body: t.Object({
      name: t.String({ minLength: 1, maxLength: 255 }),
      parent: t.Optional(t.Number()),
      description: t.Optional(t.String({ maxLength: 255 })),
    })
  });