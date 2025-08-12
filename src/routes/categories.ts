import { db } from "../drizzle/db";
import { categories } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Get all non-deleted categories
    const allCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.deleted, false))
      .orderBy(categories.name);

    // Separate parent categories and subcategories
    const parentCategories = allCategories.filter((cat) => cat.parent === null);
    const subcategories = allCategories.filter((cat) => cat.parent !== null);

    // Build hierarchical structure
    const categoriesWithChildren = parentCategories.map((parent) => ({
      ...parent,
      children: subcategories.filter((sub) => sub.parent === parent.id) ?? [],
    }));

    return Response.json({
      success: true,
      data: {
        allCategories: allCategories,
        categories: categoriesWithChildren,
        total: allCategories.length,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Response.json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
}

export async function POST(request: Request) {
  try {
    const {
      name = null,
      description = null,
      parent = null,
    } = await request.json();

    // Get all non-deleted categories
    const allCategories = await db
      .insert(categories)
      .values({
        name: name,
        parent: parent,
        description: description,
      })
      .returning({
        insertedId: categories.id,
      });
    return Response.json(
      { message: "Category created", data: allCategories },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Response.error();
  }
}