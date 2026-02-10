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

export default function AccountPage() {
  const {update: updateSession} = useSession()
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<Profile | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    first_name: "",
    last_name:  ""
  })

  const loadAccountData = async () => {
    const response = await userService.getAccount()
    setUserData(response)
  }

  useEffect(() => {
    loadAccountData()
  }, [])

  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.user.first_name || "" ,
        last_name: userData.user.last_name || ""
      })
    }
  }, [userData])

  const handleSubmit = async () => {
    setLoading(true)
    
    await userService.updateAccount(formData).then((response) => {
      loadAccountData()
      updateSession({
        profile: response
      })
      toast.success("Account updated successfully!", {
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
        toast.error("An error occurred while updating the account.", {
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

  const formChanged = () => {
    return formData.first_name !== userData?.user.first_name || formData.last_name !== userData?.user.last_name
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
                  <FieldLegend>Update your profile information</FieldLegend>
                  <FieldDescription>
                  </FieldDescription>
                  <FieldGroup>
                    

                    <Field>
                      <FieldLabel htmlFor="first_name">
                        First Name
                      </FieldLabel>
                      <Input
                        id="first_name"
                        type="text"
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        value={formData.first_name}
                        disabled={loading}
                        aria-invalid={errors.first_name ? "true" : "false"}
                      />
                      {errors.first_name && (
                        <FieldDescription className="text-xs text-destructive">
                          {errors.first_name}
                        </FieldDescription>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="last_name">
                        Last Name
                      </FieldLabel>
                      <Input
                        id="last_name"
                        type="text"
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                        value={formData.last_name}
                        disabled={loading}
                        aria-invalid={errors.last_name ? "true" : "false"}
                      />
                      {errors.last_name && (
                        <FieldDescription className="text-xs text-destructive">
                          {errors.last_name}
                        </FieldDescription>
                      )}
                    </Field>

                  </FieldGroup>
                </FieldSet>
                
                
                <Field orientation="horizontal">
                  <Button type="submit" disabled={loading || !formChanged()}>Submit</Button>
                  {formChanged() &&
                    <Button variant="link" disabled={loading} onClick={(e) => {
                      e.preventDefault();
                      if (userData) {
                        setFormData({
                          first_name: userData.user.first_name || "",
                          last_name: userData.user.last_name || ""
                        })
                      }
                    }}>Reset</Button>
                  }
                </Field>
              </FieldGroup>
            </form>
            
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

