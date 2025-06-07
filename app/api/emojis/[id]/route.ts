import { db } from "@/server/db"
import { emojis } from "@/server/schema"
import { EmojiContextProps, Response } from "@/server/utils"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const runtime = "edge"
export const fetchCache = "force-no-store"
export const revalidate = 0

export async function GET(request: Request, { params }: EmojiContextProps) {
  try {
    await params;
    const emoji = await db.query.emojis.findFirst({
      where: eq(emojis.id, params.id)
    })
    if (!emoji) return Response.emojiNotFound()

    return NextResponse.json({ emoji }, { status: 200 })
  } catch (error) {
    console.error(error)
    return Response.internalServerError()
  }
}
