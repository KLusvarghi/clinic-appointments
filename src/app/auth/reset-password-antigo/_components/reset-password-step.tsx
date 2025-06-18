"use client";

import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ResetPasswordFormData } from "../_types/schema";

interface ResetPasswordStepProps {
  form: UseFormReturn<ResetPasswordFormData>;
  isLoading: boolean;
  onSubmit: (values: ResetPasswordFormData) => void;
  onBack: () => void;
}

export function ResetPasswordStep({
  form,
  isLoading,
  onSubmit,
  onBack,
}: ResetPasswordStepProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-1">
          <Button
            type="submit"
            className="h-12 w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
          <Button
            type="button"
            className="h-12 w-full text-blue-600"
            variant="ghost"
            onClick={onBack}
            disabled={isLoading}
          >
            Back
          </Button>
        </div>
      </form>
    </Form>
  );
} 