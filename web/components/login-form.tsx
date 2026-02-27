"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { data, isPending, isRefetching } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !isRefetching && data) {
      router.replace("/");
    }
  }, [data, isPending, isRefetching, router]);

  const onSubmit = async (values: LoginFormValues) => {
    const loadingToast = toast.loading("Signing in...");

    try {
      const result = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (!result.data) {
        toast.dismiss(loadingToast);
        toast.error("Invalid email or password");
        return;
      }

      toast.dismiss(loadingToast);
      toast.success("Welcome back, Admin 👋");
      router.push("/");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Login failed. Please try again.");
      console.error("Login failed:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "flex flex-col gap-6 max-w-md w-full mx-auto p-6 rounded-xl border bg-background shadow-sm",
        className,
      )}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Warehouse Operations
          </div>
          <h1 className="text-2xl font-semibold">Admin Control Panel</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to manage warehouse activity
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Admin Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="admin@warehouse.com"
            className="h-10"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            className="h-10"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </Field>

        <Field>
          <Button type="submit" className="w-full h-10" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Access Dashboard"}
          </Button>
        </Field>

        <div className="text-center text-xs text-muted-foreground">
          Authorized personnel only
        </div>
      </FieldGroup>
    </form>
  );
}
