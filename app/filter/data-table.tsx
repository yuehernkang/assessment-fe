"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
} from "@tanstack/react-table"
import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    totalPrice: number
    totalPages: number
    onPageChange?: (page: number) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    totalPrice,
    totalPages,
    onPageChange
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    })

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        state: {
            sorting,
            pagination,
        },
        manualPagination: true,
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: totalPages
    })

    const handlePageChange = (newPage: number) => {
        const pageIndex = newPage - 1
        setPagination(prev => ({ ...prev, pageIndex }))
        onPageChange?.(newPage)
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 py-4 px-4">
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {pagination.pageIndex + 1} of {totalPages}
                </div>
                <div className="space-x-2">
                    <button
                        onClick={() => handlePageChange(pagination.pageIndex)}
                        disabled={pagination.pageIndex === 0}
                        className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                        <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            disabled={pageNumber === pagination.pageIndex + 1}
                            className={`px-3 py-1 border rounded hover:bg-gray-100 ${pageNumber === pagination.pageIndex + 1 ? "bg-gray-200" : ""
                                }`}
                        >
                            {pageNumber}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(pagination.pageIndex + 2)}
                        disabled={pagination.pageIndex + 1 === totalPages}
                        className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}