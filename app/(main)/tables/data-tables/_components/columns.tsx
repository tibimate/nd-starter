"use client"
 
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenu } from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Pencil, Trash } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./DataTableColumnHeader"
import { Client } from "@/types/models"
import { Badge } from "@/components/ui/badge"
import clsx from "clsx"
import DialogClient from "./DialogClient"
import { AlertDelete } from "./AlertDelete"


export const columns: ColumnDef<Client>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "tin",
    header: "TIN",
  },
  {
    accessorKey: "phone_number",
    header: "Phone Number",
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => {
      const active = row.getValue("active")
 
      return <div><Badge className={clsx(
        active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      )}>{active ? "Active" : "Inactive"}</Badge></div>
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string
      return <div>{new Date(date).toLocaleDateString()}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => <ActionsCell client={row.original} table={table} />,
  },
]

interface ActionsCellProps {
  client: Client
  table: any
}

function ActionsCell({ client, table }: ActionsCellProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const handleEditClick = () => {
    setShowEditDialog(true)
  }

  const handleDeleteClick = () => {
    setShowDeleteAlert(true)
  }

  return (
    <>
      <div className="text-right font-medium">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="text-right">
            <Button variant="ghost" className="h-8 w-8 p-0 text-right">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleEditClick}>
              <Pencil className="size-3 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteClick}>
              <Trash className="size-3 mr-2" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {showEditDialog &&
        <DialogClient
          client={client} 
          isOpen={true}
          onUpdated={(updatedClient) => {
            const meta = table.options.meta as { onClientUpdated?: (client: Client) => void };
            if (meta?.onClientUpdated) {
              meta.onClientUpdated(updatedClient);
            }
            setShowEditDialog(false)
          }}
        >
          <button style={{ display: 'none' }} />
        </DialogClient>
}
      
      
      {showDeleteAlert && (
        <AlertDelete 
          client={client} 
          isOpen={true}
          onDeleted={(deletedClient) => {
            const meta = table.options.meta as { onClientDeleted?: (client: Client) => void };
            if (meta?.onClientDeleted) {
              meta.onClientDeleted(deletedClient);
            }
            setShowDeleteAlert(false)
          }}
        >
          <button style={{ display: 'none' }} />
        </AlertDelete>
      )}
    </>
  )
}