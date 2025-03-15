// filepath: /c:/Users/RICKY DEY/OneDrive/Desktop/Interior_work/Interrior-AI/components/navbar.tsx
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Paintbrush } from "lucide-react";
import { AuthButton } from "./auth-button";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <Paintbrush className="h-6 w-6" />
          <span className="text-xl font-bold">RoomAI</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/redesign">
            <Button variant="ghost">Redesign</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost">Pricing</Button>
          </Link>
          <Link href="/auth-test">
            <Button variant="ghost">Auth Test</Button>
          </Link>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}