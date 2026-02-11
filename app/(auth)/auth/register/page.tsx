"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { userService } from "@/hooks/userService";

export default function RegisterPage() {
  const router = useRouter();
  

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async () => {
    setErrors({});
    setLoading(true);
    
    await userService.registerUser(formData).then((response) => {
      router.push("/auth/login?registered=true")
    }).catch((error) => {
      if (error.response && error.response.data) {
        console.error("Registration error:", error.response.data);
        setErrors(error.response.data);
      } else {
        setErrors({ general: "An error occurred. Please try again." });
      }
    }).finally(() => {
      setLoading(false);
    });

  };

  // Show registration form if allowed
  return (
    
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
              <Input
                id="firstName"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                required
                aria-invalid={errors.first_name ? "true" : "false"}
              />
              {errors.first_name && (
                <FieldDescription className="text-xs text-destructive">
                  {errors.first_name}
                </FieldDescription>
              )}  
              
            </Field>
            <Field>
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
              <Input
                id="lastName"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                required
                aria-invalid={errors.last_name ? "true" : "false"}
              />
              {errors.last_name && (
                <FieldDescription className="text-xs text-destructive">
                  {errors.last_name}
                </FieldDescription>
              )}
              
            </Field>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                aria-invalid={errors.username ? "true" : "false"}
              />
              {errors.username && (
                <FieldDescription className="text-xs text-destructive">
                  {errors.username}
                </FieldDescription>
              )}
              
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="m@example.com"
                required
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <FieldDescription className="text-xs text-destructive">
                  {errors.email}
                </FieldDescription>
              )}
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <FieldDescription className="text-xs text-destructive">
                  {errors.password}
                </FieldDescription>
              )}
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                aria-invalid={errors.confirm_password ? "true" : "false"}
              />
              {errors.confirm_password && (
                <FieldDescription className="text-xs text-destructive">
                  {errors.confirm_password}
                </FieldDescription>
              )}
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={loading}>Create Account</Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/auth/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

