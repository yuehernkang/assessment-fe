export const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Food",
    "Toys",
] as const

export type Category = typeof categories[number]