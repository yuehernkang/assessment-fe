"use client"

import { useEffect, useState } from "react"
import { AddProductDialog } from "@/components/homepage/addProductDialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DateRange } from "react-day-picker"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { categories } from "@/lib/constants"
import { ProductTable } from "@/components/homepage/product-table/product-table"
import { Product } from "@/types/Product"
import AuthButton from "@/components/authButton"


interface Response {
  items: Product[]
  total_price: number
  total_items: number  // Add this field for pagination
}

export default function Home() {
  const [data, setData] = useState<Response>()
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState<DateRange | undefined>()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 5  // Changed from 10 to 5

  const fetchProducts = async (filters?: { dateRange?: DateRange; category?: string; page?: number }) => {
    setIsLoading(true)
    try {
      let url = 'https://87pf5ib5j4.execute-api.ap-southeast-1.amazonaws.com/items'
      const queryParams = new URLSearchParams()

      // Add pagination parameters
      queryParams.append('page', (filters?.page || 1).toString())
      queryParams.append('limit', itemsPerPage.toString())

      // Handle date range
      if (filters?.dateRange?.from && filters?.dateRange?.to) {
        queryParams.append('dt_from', Math.floor(filters.dateRange.from.getTime() / 1000).toString())
        queryParams.append('dt_to', Math.floor(filters.dateRange.to.getTime() / 1000).toString())
      }

      // Handle category
      if (filters?.category && filters?.category !== 'all') {
        queryParams.append('category', filters.category)
      }

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const products = await response.json()
      setData(products)
      // Update total pages based on total items
      if (products.total_items) {
        setTotalPages(Math.ceil(products.total_items / itemsPerPage))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    fetchProducts({
      dateRange: date,
      category: selectedCategory,
      page: newPage
    })
  }

  return (
    <div className="p-4">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Products</h2>
          <AddProductDialog onProductAdded={() => fetchProducts()} />
          {/* <AuthButton /> */}
        </div>
        <div className="flex gap-4 mb-6">
          <DatePickerWithRange
            date={date}
            onDateChange={setDate}
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              setCurrentPage(1)
              fetchProducts({
                dateRange: date,
                category: selectedCategory,
                page: 1
              })
            }}
          >
            Filter
          </Button>
        </div>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <>
            <ProductTable data={data} />
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}