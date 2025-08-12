import { db, accounts } from "./db";
import type { Account } from "./db";

// Function to fetch all accounts
export async function getAllAccounts(): Promise<Account[]> {
  try {
    console.log("Fetching all accounts from database...");
    const allAccounts = await db.select().from(accounts);
    console.log(`Found ${allAccounts.length} accounts`);
    return allAccounts;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
}

