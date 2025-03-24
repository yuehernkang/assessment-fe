"use client"

import { getRelativeTimeString } from "@/lib/utils"
import { Product } from "@/types/Product"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "pk",
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
        accessorKey: "updated_at",
        header: "Last Updated",
        cell: ({ row }) => {
            return getRelativeTimeString(row.original.updated_at)
        }
    },
]
