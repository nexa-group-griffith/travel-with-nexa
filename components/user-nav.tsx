"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import {
  removeTopDestinationsFromLocalStorage,
  removeUserDataFromLocalStorage,
} from "@/lib/localstorage";

interface UserNavProps {
  user: User;
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      if (!auth) {
        throw new Error("Authentication is not initialized");
      }

      await signOut(auth).then(() => {
        removeTopDestinationsFromLocalStorage();
        removeUserDataFromLocalStorage();
        router.push("/login");
      });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred while signing out",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 hover:bg-primary/10 hover:scale-105">
            <AvatarImage
              src={user.photoURL || ""}
              alt={user.displayName || "User"}
            />
            <AvatarFallback className="h-8 w-8 hover:bg-primary/10 hover:scale-105">
              {user.displayName?.charAt(0) ||
                user.email?.charAt(0).toUpperCase() ||
                "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/trips")}>
            My Trips
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/wishlist")}>
            Wishlist
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/about")}>
            About Us
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
