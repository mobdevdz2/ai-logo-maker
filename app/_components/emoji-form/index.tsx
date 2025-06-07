"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { createEmoji, FormState } from "./action"
import { SubmitButton } from "./submit-button"
import toast from "sonner"
import useSWR from "swr"

interface EmojiFormProps {
  initialPrompt?: string
}

export function EmojiForm({ initialPrompt }: EmojiFormProps) {
  const [formState, formAction] = useActionState(
    (state: FormState | void, formData: FormData) => createEmoji(state as FormState | undefined, formData),
    {
      "message": ""
    }
  )
  const submitRef = useRef<React.ComponentRef<"button">>(null)
  const [token, setToken] = useState("")

  useEffect(() => {
    if (!formState) return
    toast.error(formState.message)
  }, [formState])

  useSWR(
    "/api/token",
    async (url: string) => {
      const res = await fetch(url)
      const json = await res.json()
      return json?.token ?? ""
    },
    {
      onSuccess: (token) => setToken(token),
    }
  )

  return (
    <form action={formAction} className="bg-black rounded-xl shadow-lg h-fit flex flex-row px-1 items-center w-full">
      <input
        defaultValue={initialPrompt}
        type="text"
        name="prompt"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            submitRef.current?.click()
          }
        }}
        placeholder="cat"
        className="bg-transparent text-white placeholder:text-gray-400 ring-0 outline-none resize-none py-2.5 px-2 font-mono text-sm h-10 w-full transition-all duration-300"
      />
      <input aria-hidden type="text" name="token" value={token} className="hidden" readOnly />
      <SubmitButton ref={submitRef} />
    </form>
  )
}
