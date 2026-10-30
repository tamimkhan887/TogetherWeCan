"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/context/events-context";
import {
  HeartHandshake,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Image as ImageIcon,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { setIsAuthenticatedPreview, updateUserProfile } = useEvents();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = watch("password") || "";

  // Password rules validation checklist
  const hasMinLength = watchedPassword.length >= 6;
  const hasUppercase = /[A-Z]/.test(watchedPassword);
  const hasLowercase = /[a-z]/.test(watchedPassword);

  const onSubmit = (data: RegisterFormData) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      updateUserProfile({
        name: data.name,
        email: data.email,
        avatar: data.photoUrl,
      });
      setIsAuthenticatedPreview(true);
      toast.success("Account created successfully!", {
        description: `Welcome aboard, ${data.name}! You are now ready to join and create events.`,
      });
      router.push("/events");
    }, 850);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-stretch">
      {/* Left Banner */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-emerald-950 text-white overflow-hidden flex-col justify-between p-12">
        <Image
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&auto=format&fit=crop&q=80"
          alt="Tree plantation community volunteers"
          fill
          className="object-cover opacity-35"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-emerald-950/40" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Together<span className="text-emerald-400">WeCan</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-sm">
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
            Start Your Volunteer Journey Today.
          </h2>

          <p className="text-emerald-100/80 leading-relaxed text-sm">
            Join thousands of active change-makers across Dhaka, Chattogram, Sylhet, and beyond.
            Collaborate on environmental, healthcare, education, and humanitarian relief projects.
          </p>

          <div className="space-y-3 pt-2 text-xs text-emerald-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Connect with verified local organizers</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Host your own community initiatives</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Track verified volunteer hours</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-emerald-300/60">
          Ready to make a difference? It takes less than a minute.
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-10 md:p-14 bg-background">
        <div className="w-full max-w-lg space-y-6">
          <div className="space-y-1.5 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Create Volunteer Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign up to discover, join, and organize community service events.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g. Tanvir Ahmed"
                  {...register("name")}
                  className={`pl-10 h-11 ${errors.name ? "border-red-500" : ""}`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className={`pl-10 h-11 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Photo URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Photo URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="https://images.unsplash.com/..."
                  {...register("photoUrl")}
                  className={`pl-10 h-11 ${errors.photoUrl ? "border-red-500" : ""}`}
                />
              </div>
              {errors.photoUrl && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.photoUrl.message}
                </p>
              )}
            </div>

            {/* Passwords in 2 columns on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={`pl-10 pr-10 h-11 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={`pl-10 pr-10 h-11 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password Requirements Checklist */}
            <div className="p-3.5 rounded-xl bg-muted/60 border border-border/80 text-xs space-y-1.5">
              <span className="font-semibold text-foreground block mb-1">
                Password Requirements:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div
                  className={`flex items-center gap-1.5 ${
                    hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"
                  }`}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Min 6 chars</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    hasUppercase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"
                  }`}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>1 uppercase letter</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    hasLowercase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"
                  }`}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>1 lowercase letter</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md font-semibold mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                "Creating Account..."
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-xs text-muted-foreground pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
