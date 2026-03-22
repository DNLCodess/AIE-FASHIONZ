import { searchProducts } from "@/lib/api/products";
import SearchResultsView from "@/components/search/SearchResultsView";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const q = params?.q ?? "";
  return {
    title: q ? `Search: "${q}"` : "Search",
    description: q ? `Search results for "${q}" at AIE Fashionz` : "Search our collections",
  };
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const q = params?.q ?? "";
  const category = params?.category ?? "";
  const sort = params?.sort ?? "";
  const page = parseInt(params?.page ?? "1", 10);

  const { results, total } = await searchProducts(q, { category, sort, page });

  return (
    <SearchResultsView
      initialResults={results}
      total={total}
      q={q}
      category={category}
      sort={sort}
      page={page}
    />
  );
}
