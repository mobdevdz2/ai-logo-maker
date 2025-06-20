"use client"

import { Analytics } from "@vercel/analytics/react"
import { AxiomWebVitals } from "next-axiom"
import { Toaster } from "sonner"

export function Providers() {
  return (
    <>
      <Analytics />
      <AxiomWebVitals />
      <Toaster position="top-right" />
    </>
  )
}
