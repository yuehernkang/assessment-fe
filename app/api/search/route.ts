import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const minPrice = searchParams.get('min_price')
  const maxPrice = searchParams.get('max_price')
  const categories = searchParams.get('categories')?.split(',')
  const sort = searchParams.get('sort')
  console.log(JSON.stringify({
    filter: [
      minPrice && maxPrice ? `price >= ${minPrice} AND price <= ${maxPrice}` : undefined,
      categories?.length ? `(${categories.map(c => `category = "${c.toLowerCase()}"`).join(' OR ')})` : null
    ].filter(Boolean).join(' AND ')
  }))
  const page = searchParams.get('page')

  try {
    const response = await fetch(`http://13.250.22.195:7700/indexes/inventory/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MEILI_MASTER_KEY}`,
      },
      body: JSON.stringify({
        hitsPerPage: 5,
        page: page ? parseInt(page) : 1,
        filter: [
          minPrice && maxPrice ? `price >= ${minPrice} AND price <= ${maxPrice}` : undefined,
          categories?.length ? `(${categories.map(c => `category = "${c.toLowerCase()}"`).join(' OR ')})` : null
        ].filter(Boolean).join(' AND '),
        sort: sort?.length
          ? [sort]
          : undefined,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch from Meilisearch')
    }

    const searchResults = await response.json()
    return NextResponse.json({
      hits: searchResults.hits,
      total_pages: searchResults.totalPages,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    )
  }
}