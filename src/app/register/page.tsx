"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget
    const formEntries = new FormData(form);
    const user = Object.fromEntries(formEntries.entries()) as {
      name: string, email: string, password: string, photoUrl: string, confirmPassword: string;
    }
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    if (user.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (user.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[a-z]/.test(user.password)) {
      newErrors.password = "Password must contain a lowercase letter (a-z).";
    } else if (!/[0-9]/.test(user.password)) {
      newErrors.password = "Password must contain a number (0-9).";
    }
    if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }
    setIsLoading(true);
    const { data, error } = await authClient.signUp.email({
      name: user.name,
      email: user.email,
      password: user.password,
      image: user.photoUrl,
    })

    if (data) {
      setIsLoading(false)
      toast.success("Welcome To TogetherWeCan", {
        description: "Thank You For SignUp In Our Website.",
      });
      form.reset()
      router.push("/")
    }
    if (error) {
      setIsLoading(false)
      console.log(error)
      toast.error(`${error?.message}`)
    }

  }
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
        <div className="absolute inset-0 bg-linear-to-t from-emerald-950 via-emerald-950/70 to-emerald-950/40" />

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

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  className="pl-10"
                  required
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
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
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  required
                />

              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Photo URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="text" name="photoUrl"
                  placeholder="Enter Image Url"
                  className="pl-10" />
              </div>
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    required
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
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
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
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    required
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
                  <p className="text-xs text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
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
