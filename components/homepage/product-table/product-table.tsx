import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Product } from "@/types/Product"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { columns } from "./columns"


interface ProductTableProps<TData, TValue> {
    data?: {
        items: Product[]
        total_price: number
    }
}

export function ProductTable<TData, TValue>({
    data,
}: ProductTableProps<TData, TValue>) {
    const table = useReactTable({
        data: data?.items || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            )
                        })}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
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
            <tfoot>
                <TableRow>
                    <TableCell colSpan={2} className="text-right font-medium">
                        Total:
                    </TableCell>
                    <TableCell className="font-bold">
                        ${data?.total_price}
                    </TableCell>
                </TableRow>
            </tfoot>
        </Table>
    )
}