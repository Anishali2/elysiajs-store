import { Elysia, t } from "elysia";
import { db } from "../drizzle/db";
import { categories, NewCategoriesSchema } from "../drizzle/schema/categories";
import { eq, and } from "drizzle-orm";

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
  })

  .get("/:id", async ({ params: { id } }) => {
    try {
      const categoryId = parseInt(id);
      if (isNaN(categoryId)) {
        return {
          success: false,
          message: "Invalid category ID",
        };
      }

      const result = await db
        .select()
        .from(categories)
        .where(and(eq(categories.id, categoryId), eq(categories.deleted, false)))
        .limit(1);

      if (result.length === 0) {
        return {
          success: false,
          message: "Category not found",
        };
      }

      return {
        success: true,
        data: result[0],
      };
    } catch (error) {
      console.error("Error fetching category:", error);
      return {
        success: false,
        message: "Failed to fetch category",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }, {
    params: t.Object({
      id: t.String()
    })
  })

  .put("/:id", async ({ params: { id }, body }) => {
    try {
      const categoryId = parseInt(id);
      if (isNaN(categoryId)) {
        return {
          success: false,
          message: "Invalid category ID",
        };
      }

      const validatedData = NewCategoriesSchema.parse(body);
      
      const result = await db
        .update(categories)
        .set({
          ...validatedData,
          updatedAt: new Date().toISOString(),
        })
        .where(and(eq(categories.id, categoryId), eq(categories.deleted, false)))
        .returning({
          id: categories.id,
          name: categories.name,
          parent: categories.parent,
          description: categories.description,
          updatedAt: categories.updatedAt,
        });

      if (result.length === 0) {
        return {
          success: false,
          message: "Category not found or already deleted",
        };
      }

      return {
        success: true,
        message: "Category updated successfully",
        data: result[0],
      };
    } catch (error) {
      console.error("Error updating category:", error);
      return {
        success: false,
        message: "Failed to update category",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      name: t.String({ minLength: 1, maxLength: 255 }),
      parent: t.Optional(t.Number()),
      description: t.Optional(t.String({ maxLength: 255 })),
    })
  })

  .delete("/:id", async ({ params: { id } }) => {
    try {
      const categoryId = parseInt(id);
      if (isNaN(categoryId)) {
        return {
          success: false,
          message: "Invalid category ID",
        };
      }

      const result = await db
        .update(categories)
        .set({
          deleted: true,
          updatedAt: new Date().toISOString(),
        })
        .where(and(eq(categories.id, categoryId), eq(categories.deleted, false)))
        .returning({
          id: categories.id,
          name: categories.name,
        });

      if (result.length === 0) {
        return {
          success: false,
          message: "Category not found or already deleted",
        };
      }

      return {
        success: true,
        message: "Category deleted successfully",
        data: result[0],
      };
    } catch (error) {
      console.error("Error deleting category:", error);
      return {
        success: false,
        message: "Failed to delete category",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }, {
    params: t.Object({
      id: t.String()
    })
  });