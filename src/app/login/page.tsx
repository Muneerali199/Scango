
// This is an autogenerated file from Firebase Studio.
"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to ScanGo</CardTitle>
          <CardDescription>
            Please choose your login method.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <Link href="/login/user" passHref>
              <Button className="w-full h-12 text-lg">
                  <User className="mr-2 h-5 w-5" />
                  Login as User
              </Button>
            </Link>
             <Link href="/login/admin" passHref>
              <Button variant="outline" className="w-full h-12 text-lg">
                  <Shield className="mr-2 h-5 w-5" />
                  Login as Admin
              </Button>
            </Link>
             <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline">
                Sign up
                </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
