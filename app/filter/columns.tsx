"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Product } from "@/types/Product"
import { formatRelativeTime } from "@/lib/utils"

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return `$${Number(row.getValue("price")).toFixed(2)}`
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
    cell: ({ row }) => {
      return formatRelativeTime(row.getValue("lastUpdated"))
    },
  },
]