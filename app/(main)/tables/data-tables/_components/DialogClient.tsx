import React, { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { clientService } from '@/hooks/clientService';
import { Client } from "@/types/models";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { is } from 'zod/locales';

interface DialogClientProps {
  children: React.ReactNode;
  client: Client | null;
  onCreated?: (client: Client) => void;
  onUpdated?: (client: Client) => void;
  isOpen?: boolean;
}

export default function DialogClient({ children,client, onCreated, onUpdated, isOpen = false }: DialogClientProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [open, setOpen] = useState(isOpen);

  const [formData, setFormData] = useState<Omit<Client, "id" | "created_at" | "updated_at">>({
    name: client?.name || '',
    email: client?.email || '',
    tin: client?.tin || '',
    phone_number: client?.phone_number || '',
    address: client?.address || '',
    active: client?.active ?? true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    console.log("Submitting form data:", formData);
    if (client) {
      await clientService.updateClient(client.id, formData)
        .then((response) => {
          toast.success("Client updated successfully!", {
            position: "top-center",
            unstyled: true,
            classNames: {
              toast: "bg-green-100 flex items-center gap-4 text-sm text-green-500 rounded-md px-4 py-3 shadow",
            },
          });
          onUpdated?.(response);
          setOpen(false);
        }).catch((error) => {
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
            toast.error("An error occurred while updating the client.", {
              position: "top-center",
              unstyled: true,
              classNames: {
                toast: "bg-red-100 flex items-center gap-4 text-sm text-red-500 rounded-md px-4 py-3 shadow",
              },
            });
          }
        }).finally(() => {
          setLoading(false);
        });
    } else {
          
      await clientService.createClient(formData)
        .then((response) => {
          toast.success("Client created successfully!", {
            position: "top-center",
            unstyled: true,
            classNames: {
              toast: "bg-green-100 flex items-center gap-4 text-sm text-green-500 rounded-md px-4 py-3 shadow",
            },
          });
          onCreated?.(response);
          setOpen(false);
        })
        .catch((error) => {
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
            toast.error("An error occurred while creating the client.", {
              position: "top-center",
              unstyled: true,
              classNames: {
                toast: "bg-red-100 flex items-center gap-4 text-sm text-red-500 rounded-md px-4 py-3 shadow",
              },
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
      }
      
  };

  return (
    
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
        <DialogTitle>{client ? 'Edit Client' : 'Create Client'}</DialogTitle>
          <DialogDescription>
            {client ? 'Edit the details of the client.' : 'Fill in the details to create a new client.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => {e.preventDefault(); handleSubmit()}} className="-mx-4 max-h-[90vh] overflow-y-auto px-4">

        <FieldGroup>
          <FieldSet>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Client Name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                required
              />
              {errors.name && <FieldDescription id="name-error" className="text-xs text-destructive">{errors.name}</FieldDescription>}
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Client Email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && <FieldDescription id="email-error" className="text-xs text-destructive">{errors.email}</FieldDescription>}
            </Field>
            <Field>
              <FieldLabel>TIN</FieldLabel>
              <Input
                name="tin"
                value={formData.tin}
                onChange={handleInputChange}
                placeholder="Tax Identification Number"
                aria-invalid={!!errors.tin}
                aria-describedby={errors.tin ? "tin-error" : undefined}
              />
              {errors.tin && <FieldDescription id="tin-error" className="text-xs text-destructive">{errors.tin}</FieldDescription>}
            </Field>
            <Field>
              <FieldLabel>Phone Number</FieldLabel>
              <Input
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="Client Phone Number"
                aria-invalid={!!errors.phone_number}
                aria-describedby={errors.phone_number ? "phone-error" : undefined}
              />
              {errors.phone_number && <FieldDescription id="phone-error" className="text-xs text-destructive">{errors.phone_number}</FieldDescription>}
            </Field>
            <Field>
              <FieldLabel>Address</FieldLabel>
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Client Address"
                aria-invalid={!!errors.address}
                aria-describedby={errors.address ? "address-error" : undefined}
              />
              {errors.address && <FieldDescription id="address-error" className="text-xs text-destructive">{errors.address}</FieldDescription>}
            </Field>

          </FieldSet>
          <FieldGroup>
            <Field orientation="horizontal">
              <Checkbox
                id="active"
                name="active"
                checked={formData.active}
                onCheckedChange={(value) => setFormData(prev => ({ ...prev, active: typeof value === 'boolean' ? value : false }))}
              />
              <FieldLabel
                htmlFor="active"
                className="font-normal"
              >
                Active
              </FieldLabel>
            </Field>
          </FieldGroup>
          <Field orientation="horizontal" className='flex justify-end'>
            <DialogClose asChild>
            <Button variant="link" type="button">
              Cancel
            </Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : client ? 'Update' : 'Create'}
            </Button>
          </Field>
        </FieldGroup>
        </form>
        
      </DialogContent>
    </Dialog>
  )

}
