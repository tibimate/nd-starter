"use client"

import { useEffect, useState } from "react";
import { userService } from "@/hooks/userService";
import AccountSidebar from "../_components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { Profile } from "@/types/models";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function AccountPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    old_password: "",
    new_password1:  "",
    new_password2:  ""
  })

  const resetForm = () => {
    setFormData({
      old_password: "",
      new_password1:  "",
      new_password2:  ""
    })
      setErrors({})
  }

  const handleSubmit = async () => {
    setLoading(true)
      setErrors({})
    await userService.updatePassword(formData).then(() => {
      resetForm()
      toast.success("Password updated successfully!", {
        position: "top-center",
        unstyled: true,
        classNames: {
          toast: "bg-green-100 flex items-center gap-4 text-sm text-green-500 rounded-md px-4 py-3 shadow",
        },
      });
    }).catch((error) => {
      console.log(error.response || error)
      
      // Handle validation errors
      if (error.response?.data) {
        const validationErrors: Record<string, string> = {}
        Object.keys(error.response.data).forEach((key) => {
          const messages = error.response.data[key]
          if (Array.isArray(messages) && messages.length > 0) {
            validationErrors[key] = messages[0]
          }
        })
        setErrors(validationErrors)
      
        toast.error("Please fix the errors in the form.", {
          position: "top-center",
          unstyled: true,
          classNames: {
            toast: "bg-red-100 flex items-center gap-4 text-sm text-red-500 rounded-md px-4 py-3 shadow",
          },
        });
      } else {
        toast.error("An error occurred while updating the password.", {
          position: "top-center",
          unstyled: true,
          classNames: {
            toast: "bg-red-100 flex items-center gap-4 text-sm text-red-500 rounded-md px-4 py-3 shadow",
          },
        });
      }
    }).finally(() => {
      setLoading(false)
    })
    
  }


  return (
    <div className="flex flex-col md:flex-row gap-8 px-4">
      <AccountSidebar />
      <div className="flex-1">
        {/* Main content */}
        
        <Card>

          <CardContent>
            <form onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend>Update your password</FieldLegend>
                  <FieldDescription>
                  </FieldDescription>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="old_password">
                        Old Password
                      </FieldLabel>
                      <Input
                        id="old_password"
                        type="password"
                        onChange={(e) => setFormData({...formData, old_password: e.target.value})}
                        value={formData.old_password}
                        disabled={loading}
                        aria-invalid={errors.old_password ? "true" : "false"}
                      />
                      {errors.old_password && (
                        <FieldDescription className="text-xs text-destructive">
                          {errors.old_password}
                        </FieldDescription>
                      )}
                    </Field>
                  </FieldGroup>
                  <FieldSeparator />
                  <FieldGroup>

                    <Field>
                      <FieldLabel htmlFor="new_password1">
                        New Password
                      </FieldLabel>
                      <Input
                        id="new_password1"
                        type="password"
                        onChange={(e) => setFormData({...formData, new_password1: e.target.value})}
                        value={formData.new_password1}
                        disabled={loading}
                        aria-invalid={errors.new_password1 ? "true" : "false"}
                      />
                        {errors.new_password1 && (
                          <FieldDescription className="text-xs text-destructive">
                            {errors.new_password1}
                          </FieldDescription>
                        )}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="new_password2">
                        Confirm New Password
                      </FieldLabel>
                      <Input
                        id="new_password2"
                        type="password"
                        aria-invalid={errors.new_password2 ? "true" : "false"}
                        onChange={(e) => setFormData({...formData, new_password2: e.target.value})}
                        value={formData.new_password2}
                        disabled={loading}
                      />
                        {errors.new_password2 && (
                          <FieldDescription className="text-xs text-destructive">
                            {errors.new_password2}
                          </FieldDescription>
                        )}
                    </Field>
                  </FieldGroup>
                </FieldSet>
                
                
                <Field orientation="horizontal">
                  <Button type="submit" disabled={loading}>Submit</Button>
                 
                </Field>
              </FieldGroup>
            </form>
            
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

