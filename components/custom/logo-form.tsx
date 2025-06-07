"use client";
import { FormGenerator } from "@/components/ui/shadcn-form";
import React from "react";


import z, { AnyZodObject, ZodEffects, ZodError, ZodIssue, ZodType } from 'zod'



export interface IFormProps<T extends Record<string, any>> {
    form: ZodEffects<ZodType<T>>,
    onSuccess?: (Tdata: T) => void,
    onError?: (error?: ZodError<T> | ZodIssue ) => void,
}

const titleSchema =  z.object({
    title: z.string().min(3),
})

const descriptionSchema =  z.object({
    description: z.string().min(3),
})

const palleteSchema =  z.object({
    pallete: z.string().array().min(3),
})




export const TitleForm: React.FC<IFormProps<typeof titleSchema._output>> = ({ form, onSuccess, onError }) => {
    return (
        <FormGenerator
            schema={form}
            onSubmit={(data) => {
                onSuccess?.(data)
            }}
            onErrorsChange={(error) => {
                onError?.(error.at(0))
            }}
        />
    )
}

export const DescriptionForm: React.FC<IFormProps<typeof descriptionSchema._output>> = ({ form, onSuccess, onError }) => {
    return (
        <FormGenerator
            schema={form}
            onSubmit={(data) => {
                onSuccess?.(data)
            }}
            onErrorsChange={(error) => {
                onError?.(error.at(0))
            }}
        />
    )
}

export const PalleteColorForm: React.FC<IFormProps<typeof palleteSchema._output>> = ({ form, onSuccess, onError }) => {
    return (
        <FormGenerator
            schema={form}
            onSubmit={(data) => {
                onSuccess?.(data)
            }}
            onErrorsChange={(error) => {
                onError?.(error.at(0))
            }}
        />
    )
}