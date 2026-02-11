"use client"
import { type Table } from "@tanstack/react-table"
import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DialogClient from "./DialogClient"
import { Client } from "@/types/models"

export function DataTableViewOptions<TData>({
  table,
  onChangeActiveFilter,
  onClientCreated,
  onClientUpdated,
}: {
  table: Table<TData>
  onChangeActiveFilter?: (active: boolean | null) => void
  onClientCreated?: (client: Client) => void
  onClientUpdated?: (client: Client) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <Settings2 />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
      <Select onValueChange={(value) => {
        if (value === "all") {
          onChangeActiveFilter?.(null);
        } else if (value === "active") {
          onChangeActiveFilter?.(true);
        } else if (value === "inactive") {
          onChangeActiveFilter?.(false);
        }
      }}>
        <SelectTrigger className="ml-2">
          <SelectValue placeholder="Active Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" onSelect={() => onChangeActiveFilter?.(null)}>
            All
          </SelectItem>
          <SelectItem value="active" onSelect={() => onChangeActiveFilter?.(true)}>
            Active
          </SelectItem>
          <SelectItem value="inactive" onSelect={() => onChangeActiveFilter?.(false)}>
            Inactive
          </SelectItem>
        </SelectContent>
      </Select>
      <DialogClient client={null} onCreated={(client) => onClientCreated?.(client)} onUpdated={(client) => onClientUpdated?.(client)}>
        <Button variant="outline" size="sm" className="ml-auto">
          Create Client
        </Button>
      </DialogClient>
    </div>
  )
}
