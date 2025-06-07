import { Response, webhookSchema } from "@/server/utils"
import { db } from "@/server/db"
import { emojis } from "@/server/schema"
import { put } from "@vercel/blob"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams
    const parsedParams = webhookSchema.safeParse(Object.fromEntries(searchParams))
    if (!parsedParams.success) return Response.invalidRequest(parsedParams.error)
    const { id } = parsedParams.data

    // get output from Replicate
    const body = await req.json()
    const { output } = body
    if (!output) return Response.badRequest("Missing output")

    // convert output to a blob object
    const file = await fetch(output).then((res) => res.blob())

    // upload & store image
    const { url } = await put(`${id}-no-background.png`, file, { access: "public" })

    // update emoji
    await db.update(emojis)
      .set({ noBackgroundUrl: url })
      .where(eq(emojis.id, id))

    return Response.success()
  } catch (error) {
    console.error(error)
    return Response.internalServerError()
  }
}
