'use client';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { create_fragment } from '@/helpers/create_fragment/';

export default function Create({ user }) {
  const FormSchema = z.object({
    fragment: z.string().min(1, {
      message: 'Fragment must be at least 1 characters.',
    }),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fragment: '',
    },
  });

  const onSubmit = async (data) => {
    const result = await create_fragment('text/plain', data.fragment, user);
    console.log(result);
    if (result.status === 'ok') {
      toast({
        title: 'You submitted the following values:',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    }
  };

  return (
    <div className="">
      <h1 className="text-3xl text-center pb-6">
        Create a fragment (only supports text/plain)
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="fragment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fragment</FormLabel>
                <FormControl>
                  <Input placeholder="Fragment" {...field} />
                </FormControl>
                <FormDescription>This is your Fragment.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="outline"
            className="bg-white text-black"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
