import { NextRequest, NextResponse } from "next/server"

interface PLOSArticle {
  id: string
  title_display: string
  abstract?: string[]
  author_display?: string[]
  publication_date: string
  journal: string
  article_type?: string
  score: number
}

interface PLOSResponse {
  response: {
    numFound: number
    docs: PLOSArticle[]
  }
}

const PLANT_QUERIES = [
  { query: "title:tomato health benefits", plant: "Tomate" },
  { query: "title:mint medicinal", plant: "Menta" },
  { query: "title:lettuce nutrition", plant: "Lechuga" },
  { query: "title:aloe vera healing", plant: "Aloe Vera" },
  { query: "title:chamomile therapeutic", plant: "Manzanilla" },
  { query: "title:garlic antimicrobial", plant: "Ajo" },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const customQuery = searchParams.get("query")
    const rows = parseInt(searchParams.get("rows") || "6")

    // If custom query provided, search for that
    if (customQuery) {
      const response = await fetch(
        `https://api.plos.org/search?q=title:${encodeURIComponent(customQuery)}&rows=${rows}&wt=json&fl=id,title_display,abstract,author_display,publication_date,journal,article_type,score`,
        { next: { revalidate: 3600 } }
      )

      if (!response.ok) {
        return NextResponse.json({ articles: [], total: 0 }, { status: 500 })
      }

      const data: PLOSResponse = await response.json()
      
      const articles = data.response.docs.map((doc) => ({
        id: doc.id,
        title: doc.title_display.replace(/<[^>]*>/g, ""),
        abstract: doc.abstract?.[0] || "",
        author_display: doc.author_display || [],
        publication_date: doc.publication_date,
        journal: doc.journal,
        article_type: doc.article_type,
        score: doc.score,
      }))

      return NextResponse.json({ 
        articles, 
        total: data.response.numFound 
      })
    }

    // Default: fetch articles for predefined plants
    const articles: Array<{
      id: string
      title: string
      abstract: string
      authors: string[]
      date: string
      journal: string
      plant: string
      url: string
    }> = []

    for (const { query, plant } of PLANT_QUERIES.slice(0, 4)) {
      const response = await fetch(
        `https://api.plos.org/search?q=${encodeURIComponent(query)}&rows=2&wt=json`,
        { next: { revalidate: 3600 } }
      )

      if (!response.ok) continue

      const data: PLOSResponse = await response.json()
      
      for (const doc of data.response.docs) {
        const abstract = doc.abstract?.[0] || ""
        articles.push({
          id: doc.id,
          title: doc.title_display.replace(/<[^>]*>/g, ""),
          abstract: abstract.length > 200 ? abstract.slice(0, 200) + "..." : abstract,
          authors: doc.author_display?.slice(0, 3) || [],
          date: doc.publication_date,
          journal: doc.journal,
          plant,
          url: `https://doi.org/${doc.id}`,
        })
      }
    }

    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    return NextResponse.json({ articles: articles.slice(0, rows), total: articles.length })
  } catch (error) {
    console.error("[v0] Error fetching PLOS articles:", error)
    return NextResponse.json({ articles: [], total: 0 }, { status: 500 })
  }
}
