import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { clientService } from "@/hooks/clientService"
import { Client } from "@/types/models"
import { Trash2Icon } from "lucide-react"
import { useState } from "react"

export function AlertDelete({children, client, onDeleted, isOpen = false}: {children: React.ReactNode, client: Client, onDeleted?: (client: Client) => void, isOpen?: boolean}) {
  const [open, setOpen] = useState(isOpen)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true);
    await clientService.deleteClient(client.id).then(() => {
      setOpen(false);
      if (onDeleted) {
        onDeleted(client);
      }
    }).catch((error) => {
      console.error("Error deleting client:", error);
    }).finally(() => {
      setLoading(false);
    });

  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent size="sm" className="p-0">
        <AlertDialogHeader className="p-6">
          <AlertDialogMedia className="size-10 bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon className="size-6" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-md">Delete client?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            This will permanently delete the client <span className="font-bold">{client.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="bg-zinc-100 px-4 py-2 rounded-b-md">
          <AlertDialogCancel variant="outline" size="sm">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={loading} size="sm" onClick={(e) => {e.preventDefault(); handleDelete()}}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
