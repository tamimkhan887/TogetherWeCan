"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Mail,
  Calendar,
  Pencil,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {

  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget
    const formEntries = new FormData(form);
    const user = Object.fromEntries(formEntries.entries()) as {
      name: string, photoUrl: string
    }
    if (
      user.name === session?.user.name &&
      user.photoUrl === session?.user.image
    ) {
      toast.info("No changes detected. Please update something first.");
      return;
    }
    const { data, error } = await authClient.updateUser({
      ...user
    })
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data) {
      toast.success("Profile updated successfully!");
      setEditModalOpen(false);
    }
  };

  const { data: session } = authClient.useSession()
  const currentUser = session?.user
  const initials = (currentUser?.name || "TA")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        badge="Volunteer Identity"
        title="Volunteer Profile Dashboard"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Profile Card Header */}
        <Card className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm">
          {/* Cover gradient strip */}
          <div className="h-32 bg-linear-to-r from-emerald-600 via-teal-700 to-emerald-800 relative">
            <div className="absolute right-6 bottom-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                User Profile
              </span>
            </div>
          </div>

          <CardContent className="p-6 sm:p-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-16 sm:-mt-12 mb-6">
              {/* Avatar */}
              <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-card rounded-full shadow-lg ring-2 ring-emerald-500/20">
                <AvatarImage src={currentUser?.image as string} alt={currentUser?.name} />
                <AvatarFallback className="text-2xl font-bold bg-emerald-100 text-emerald-800">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Edit Profile Action */}
              <Button
                onClick={() => setEditModalOpen(true)}
                variant="outline"
                className="rounded-xl border-border hover:bg-secondary gap-2 h-10 px-4 text-xs font-semibold"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </Button>
            </div>

            {/* Profile Info Details */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2">
                  <span>{currentUser?.name}</span>
                </h1>
              </div>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground pt-2 border-t border-border/60">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{currentUser?.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Account Open Date : {currentUser?.createdAt?.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Modal Dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update your name , image url
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Full Name</label>
              <Input
                name="name"
                defaultValue={currentUser?.name as string}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Avatar Image URL</label>
              <Input name="photoUrl" defaultValue={currentUser?.image as string} />
            </div>

            <DialogFooter className="pt-4 flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
