"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { categories } from "@/lib/constants"
import { Product } from "@/types/Product"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default function FilterPage() {
    const [priceRange, setPriceRange] = useState([0, 1000])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [sortBy, setSortBy] = useState("")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
    const [data, setData] = useState<Product[]>([])
    const [totalPrice, setTotalPrice] = useState<number>()
    const [totalPages, setTotalPages] = useState<number>()
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/search')
            const result = await response.json()
            console.log(result)
            setTotalPrice(result.total_price)
            setTotalPages(result.total_pages)
            setData(result.hits)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleFilter = async (pageNumber?: number) => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (pageNumber) {
                params.append('page', pageNumber.toString())
            }
            if (priceRange[0] !== 0) {
                params.append('min_price', priceRange[0].toString())
                params.append('max_price', priceRange[1].toString())
            }
            if (priceRange[1] !== 1000) {
                params.append('min_price', priceRange[0].toString())
                params.append('max_price', priceRange[1].toString())
            }

            if (selectedCategories.length > 0) {
                params.append('categories', selectedCategories.join(','))
            }
            if (sortBy) {
                params.append('sort', `${sortBy}:${sortOrder}`)
            }

            const response = await fetch(`/api/search?${params}`)
            const result = await response.json()
            console.log(result)
            setTotalPrice(result.total_price)
            setData(result.hits)
        } catch (error) {
            console.error('Error fetching filtered results:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-8">
            <div className="space-y-6 mb-8">
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Price Range</h3>
                    <div className="flex items-center gap-4">
                        <span>${priceRange[0]}</span>
                        <Slider
                            min={0}
                            max={1000}
                            step={10}
                            value={priceRange}
                            onValueChange={setPriceRange}
                            className="w-[60%]"
                        />
                        <span>${priceRange[1]}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Categories</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {categories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                                <Checkbox
                                    id={category}
                                    checked={selectedCategories.includes(category)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedCategories([...selectedCategories, category])
                                        } else {
                                            setSelectedCategories(selectedCategories.filter(c => c !== category))
                                        }
                                    }}
                                />
                                <label htmlFor={category}>{category}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Sort By</h3>
                    <div className="flex gap-2">
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select sorting" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="price">Price</SelectItem>
                                <SelectItem value="category">Category</SelectItem>
                                <SelectItem value="lastUpdated">Last Updated</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={sortOrder}
                            onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
                            disabled={!sortBy}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="asc">Ascending</SelectItem>
                                <SelectItem value="desc">Descending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button onClick={() => handleFilter()} disabled={isLoading}>
                    {isLoading ? "Filtering..." : "Apply Filters"}
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={data}
                totalPrice={totalPrice || 0}
                totalPages={totalPages || 0}
                onPageChange={(page) => handleFilter(page)}
            />
        </div>
    )
}