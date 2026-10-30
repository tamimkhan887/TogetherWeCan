"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/context/events-context";
import {
  HeartHandshake,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { setIsAuthenticatedPreview } = useEvents();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "tanvir.ahmed@example.com",
      password: "Password123!",
      rememberMe: true,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setIsLoading(true);
    // Client-side simulation of login
    setTimeout(() => {
      setIsLoading(false);
      setIsAuthenticatedPreview(true);
      toast.success("Welcome back, Tanvir!", {
        description: "You have successfully logged in to the volunteer portal.",
      });
      router.push("/events");
    }, 800);
  };

  const handleGoogleLogin = () => {
    toast.info("Google Authentication (UI Demo)", {
      description: "Backend OAuth integration will be connected by you later.",
    });
    setIsAuthenticatedPreview(true);
    setTimeout(() => {
      router.push("/events");
    }, 600);
  };

  const handleForgotPassword = () => {
    toast.info("Password Reset Requested", {
      description: "A reset link has been dispatched to your email address (Simulated).",
    });
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-stretch">
      {/* Split Layout: Left Banner (Community Image & Quote) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-emerald-950 text-white overflow-hidden flex-col justify-between p-12">
        <Image
          src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&auto=format&fit=crop&q=80"
          alt="Community volunteering in Bangladesh"
          fill
          className="object-cover opacity-35"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-emerald-950/30" />

        {/* Top Branding */}
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

        {/* Motivational Statement */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Volunteer Network</span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Join Thousands of Volunteers Transforming Communities Across Bangladesh.
          </h2>

          <p className="text-emerald-100/80 leading-relaxed text-sm">
            &ldquo;The best way to find yourself is to lose yourself in the service of
            others. Every blanket given, tree planted, and child fed builds a resilient nation.&rdquo;
          </p>

          <div className="pt-4 flex items-center gap-6 text-xs text-emerald-200/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>4,800+ Volunteers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>120+ Events Organized</span>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="relative z-10 text-xs text-emerald-300/60">
          © 2026 TogetherWeCan Social Development Platform
        </div>
      </div>

      {/* Split Layout: Right Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-16 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <div className="lg:hidden inline-flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <HeartHandshake className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg">TogetherWeCan</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your volunteer dashboard and events.
            </p>
          </div>

          {/* Social Login Button (Visual Mock) */}
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full h-11 rounded-xl border-border flex items-center justify-center gap-3 hover:bg-secondary transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-sm font-semibold">Continue with Google</span>
            </Button>

            <div className="relative my-6 text-center text-xs">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <span className="relative bg-background px-3 text-muted-foreground uppercase tracking-wider font-semibold">
                Or log in with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Email Address
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

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
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

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                {...register("rememberMe")}
                className="h-4 w-4 rounded border-border text-emerald-600 focus:ring-emerald-500"
              />
              <label
                htmlFor="rememberMe"
                className="text-xs text-muted-foreground cursor-pointer select-none"
              >
                Keep me logged in for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md font-semibold mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                "Signing In..."
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Registration link */}
          <p className="text-center text-xs text-muted-foreground pt-4">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
