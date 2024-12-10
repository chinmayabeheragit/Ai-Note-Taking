"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);
  const router = useRouter();

  useEffect(() => {
    user && CheckUser();
  }, [user]);

  const CheckUser = async () => {
    const result = await createUser({
      email: user?.primaryEmailAddress?.emailAddress,
      imageUrl: user?.imageUrl,
      username: user?.fullName,
    });

    console.log(result);
  };

  const navigateToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500">
          Welcome to AI-PDF Note Taker
        </span>
      </h1>
      <p className="text-lg md:text-2xl text-white font-medium mb-12">
        Generate your notes from PDF with the power of AI.
      </p>
      <Button
        className="px-8 py-4 bg-white text-purple-600 hover:bg-purple-700 hover:text-white transition-all font-semibold text-lg rounded-lg shadow-md"
        onClick={navigateToDashboard}
      >
        Get Started
      </Button>
      <div className="mt-8">
        <UserButton />
      </div>
    </div>
  );
}
