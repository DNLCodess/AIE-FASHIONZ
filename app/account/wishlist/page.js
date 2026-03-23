import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { getProducts } from "@/lib/api/products";
import RemoveWishlistButton from "@/components/account/RemoveWishlistButton";

export const metadata = { title: "Wishlist | Aiefashion" };

export default async function WishlistPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { data: wishlistRows } = await supabase
    .from("wishlist")
    .select("product_id")
    .eq("user_id", user.id);

  const productIds = wishlistRows?.map((r) => r.product_id) ?? [];

  const wishlisted = productIds.length
    ? await getProducts({ ids: productIds })
    : [];

  return (
    <div>
      <h2 className="font-heading text-2xl text-foreground mb-8">
        Wishlist{wishlisted.length > 0 && <span className="font-body text-base text-muted ml-3">({wishlisted.length})</span>}
      </h2>

      {wishlisted.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
          {wishlisted.map((product) => (
            <WishlistCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="border border-border px-8 py-14 text-center">
          <div className="w-px h-10 bg-border mx-auto mb-6" />
          <p className="font-heading text-xl text-muted mb-2">Your wishlist is empty</p>
          <p className="font-body text-base text-muted mb-8">
            Save pieces you love by tapping the heart icon on any product.
          </p>
          <Link
            href="/shop"
            className="inline-block px-10 py-4 font-body text-base tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors"
          >
            Browse Collections
          </Link>
        </div>
      )}
    </div>
  );
}

function WishlistCard({ product }) {
  const primaryImage =
    product.images?.find((i) => i.is_primary)?.url ?? product.images?.[0]?.url;
  const currency = "GBP";

  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-gold-light mb-3">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          {primaryImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage}
              alt={product.title}
              className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
            />
          )}
        </Link>
        <RemoveWishlistButton productId={product.id} />
      </div>
      <Link href={`/product/${product.slug}`} className="block">
        <p className="font-body text-base text-foreground line-clamp-2 leading-snug mb-1">
          {product.title}
        </p>
        <p className="font-heading text-base text-gold">
          {formatCurrency(product.base_price, currency)}
        </p>
      </Link>
    </div>
  );
}
