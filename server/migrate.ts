import { sql } from "@vercel/postgres"
import { readFileSync } from "fs"
import { join } from "path"

async function main() {
  const migration = readFileSync(join(process.cwd(), "drizzle", "0000_initial.sql"), "utf-8")
  
  try {
    await sql.query(migration)
    console.log("Migration completed successfully")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

main() 