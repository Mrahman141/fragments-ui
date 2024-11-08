'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from '@/hooks/use-toast'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { create_fragment } from '@/helpers/create_fragment/'

const contentTypes = [
  'text/plain',
  'text/markdown',
  'text/html',
  'text/csv',
  'application/json',
]

const FormSchema = z.object({
  contentType: z.enum(contentTypes),
  fragment: z.string().min(1, {
    message: 'Fragment must be at least 1 character.',
  }),
})

export default function Create({ user }) {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      contentType: 'text/plain',
      fragment: '',
    },
  })

  const contentType = form.watch('contentType')

  const onSubmit = async (data) => {
    let processedFragment = data.fragment
  
    // Only process for JSON validation; other types remain raw
    if (data.contentType === 'application/json') {
      try {
        processedFragment = JSON.parse(data.fragment)
      } catch (error) {
        console.error('Invalid JSON:', error)
        toast({
          title: 'Error',
          description: 'Invalid JSON format',
          variant: 'destructive',
        })
        return
      }
    }
  
    // Send the raw content directly
    const result = await create_fragment(data.contentType, processedFragment, user)
    console.log(result)
    if (result.status === 'ok') {
      toast({
        title: 'Fragment created successfully',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify({ contentType: data.contentType, fragment: processedFragment }, null, 2)}</code>
          </pre>
        ),
      })
    }
  }
  


  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center pb-6 px-20">Create a Fragment</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full mx-auto">
          <FormField
            control={form.control}
            name="contentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a content type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select the type of content you want to create.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fragment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fragment</FormLabel>
                <FormControl>
                  {contentType === 'text/plain' ? (
                    <Input placeholder="Enter your text" {...field} />
                  ) : (
                    <Textarea
                      placeholder={`Enter your ${contentType.split('/')[1]} content`}
                      className="min-h-[200px]"
                      {...field}
                    />
                  )}
                </FormControl>
                <FormDescription>Enter your fragment content.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200">
            Create Fragment
          </Button>
        </form>
      </Form>
    </div>
  )
}