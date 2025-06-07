import "server-only"
import { db } from "./db"
import { emojis } from "./schema"
import { eq } from "drizzle-orm"

export const getEmoji = async (id: string) =>
  db.query.emojis.findFirst({
    where: eq(emojis.id, id)
  })
