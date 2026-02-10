"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";


export default function RegisterPage() {
  const router = useRouter();
  

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add client-side validation (e.g. password match, email format) before sending request

  };

  // Show registration form if allowed
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-2 text-center">Create Account</h1>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Comming soon
      </p>
      <Link href="/auth/login" className="text-sm text-blue-500 hover:underline block text-center">
        Already have an account? Sign in
      </Link>
    </div>
  );
}
