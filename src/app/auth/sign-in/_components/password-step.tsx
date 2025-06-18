import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { LoginSchema } from "../_types/schema";

interface Props {
  form: UseFormReturn<LoginSchema>;
  isLoading: boolean;
  onSubmit: (values: LoginSchema) => void;
  onBack: () => void;
}

export const PasswordStep = ({ form, isLoading, onSubmit, onBack }: Props) => {
  const router = useRouter();
  useEffect(() => {
    form.setFocus("password");
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  disabled
                  className="bg-gray-50"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Senha */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="********"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remember-me (parte do schema) */}
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <FormLabel className="text-sm">Remember me</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full justify-end">
          <button
            type="button"
            onClick={() => {
              router.push(
                `/auth/reset-password?email=${encodeURIComponent("teste")}`,
              );
            }}
            className="cursor-pointer text-sm text-blue-600 hover:text-blue-700"
          >
            Forgot your password?
          </button>
        </div>

        {/* Ações */}
        <div className="space-y-2 pt-2">
          <Button
            type="submit"
            className="h-12 w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-12 w-full text-blue-600"
            disabled={isLoading}
            onClick={onBack}
          >
            Go back
          </Button>
        </div>
      </form>
    </Form>
  );
};
