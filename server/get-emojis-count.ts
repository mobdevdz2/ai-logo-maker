import "server-only"
import { db } from "./db"
import { count } from "drizzle-orm"
import { emojis } from "./schema"

export const getEmojisCount =  () => db.select({ value: count() })
.from(emojis)
