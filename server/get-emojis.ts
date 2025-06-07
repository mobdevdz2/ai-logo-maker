import "server-only"
import { db } from "./db"
import { emojis } from "./schema"
import { desc, eq, and, isNull } from "drizzle-orm"

export const VALID_EMOJI_FILTER = and(
  eq(emojis.isFlagged, false),
  isNull(emojis.error)
)

export const getEmojis = async (opts: {
  take?: number
  skip?: number
  orderBy?: "createdAt" | "updatedAt"
  orderDirection?: "asc" | "desc"
}) => {
  const take = opts.take ?? 100
  const skip = opts.skip ?? 0
  const orderBy = opts.orderBy ?? "createdAt"
  const orderDirection = opts.orderDirection ?? "desc"

  return db.query.emojis.findMany({
    columns: {
      id: true,
      updatedAt: true
    },
    where: VALID_EMOJI_FILTER,
    limit: take,
    offset: skip,
    orderBy: orderDirection === "desc" ? desc(emojis[orderBy]) : emojis[orderBy]
  })
}
