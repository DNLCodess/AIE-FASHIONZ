import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { StarDisplay } from "./StarRating";
import ReviewForm from "./ReviewForm";

/**
 * Server component — fetches reviews + checks if current user can review.
 * Renders both the review list and (if eligible) the review form.
 */
export default async function ReviewList({ productId, productTitle }) {
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

  // Fetch reviews for this product
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, title, body, is_verified, created_at, user_id")
    .eq("product_id", productId)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(20);

  const list = reviews ?? [];
  const count = list.length;
  const avgRating = count > 0
    ? Math.round((list.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
    : 0;

  // Tally per star for the distribution bar
  const tally = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: list.filter((r) => r.rating === star).length,
  }));

  // Check if current user is eligible to review (delivered/shipped order with this product)
  const { data: { user } } = await supabase.auth.getUser();
  let canReview = false;
  let eligibleOrderId = null;
  let existingReview = null;

  if (user) {
    // Check existing review
    const { data: existing } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("user_id", user.id)
      .maybeSingle();
    existingReview = existing;

    if (!existingReview) {
      // Find a delivered/shipped order containing this product
      const { data: eligibleOrder } = await supabase
        .from("orders")
        .select("id, order_items!inner(product_id)")
        .eq("user_id", user.id)
        .in("status", ["delivered", "shipped"])
        .eq("order_items.product_id", productId)
        .limit(1)
        .maybeSingle();

      if (eligibleOrder) {
        canReview = true;
        eligibleOrderId = eligibleOrder.id;
      }
    } else {
      // Can edit existing review
      canReview = true;
      eligibleOrderId = existingReview.order_id;
    }
  }

  return (
    <section style={{ borderTop: "1px solid var(--color-border)", paddingTop: "4rem" }}>

      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", color: "var(--color-foreground)" }}>
          Customer Reviews
        </h2>
        {count > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <StarDisplay rating={avgRating} size={18} />
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--color-foreground)" }}>
              {avgRating}
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-muted)" }}>
              ({count} review{count !== 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }} className="lg:grid-cols-[1fr_360px]">

        {/* ── Left: review list ── */}
        <div>
          {count === 0 ? (
            <div style={{ border: "1px solid var(--color-border)", padding: "3rem 2rem", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--color-foreground)", marginBottom: "6px" }}>
                No reviews yet
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-muted)" }}>
                Be the first to review this product after your purchase.
              </p>
            </div>
          ) : (
            <>
              {/* Rating distribution */}
              <div style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "6px" }}>
                {tally.map(({ star, count: c }) => (
                  <div key={star} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-muted)", width: "32px", flexShrink: 0 }}>
                      {star}★
                    </span>
                    <div style={{ flex: 1, height: "6px", backgroundColor: "var(--color-border)", borderRadius: "3px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: count > 0 ? `${(c / count) * 100}%` : "0%",
                          backgroundColor: "var(--color-gold)",
                          transition: "width 600ms ease",
                        }}
                      />
                    </div>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-muted)", width: "20px", flexShrink: 0 }}>
                      {c}
                    </span>
                  </div>
                ))}
              </div>

              {/* Individual reviews */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {list.map((review, i) => (
                  <div
                    key={review.id}
                    style={{
                      padding: "1.5rem 0",
                      borderTop: i === 0 ? "1px solid var(--color-border)" : "none",
                      borderBottom: "1px solid var(--color-border)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <StarDisplay rating={review.rating} size={14} />
                        {review.is_verified && (
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-success)", border: "1px solid var(--color-success)", padding: "2px 7px" }}>
                            Verified purchase
                          </span>
                        )}
                      </div>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-subtle)", flexShrink: 0 }}>
                        {new Date(review.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    {review.title && (
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, color: "var(--color-foreground)", marginBottom: "6px" }}>
                        {review.title}
                      </p>
                    )}
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-muted)", lineHeight: 1.75 }}>
                      {review.body}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Right: write a review ── */}
        <div>
          <div style={{ border: "1px solid var(--color-border)", padding: "1.5rem" }}>
            <h3 style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: "1.25rem" }}>
              {existingReview ? "Edit your review" : "Write a review"}
            </h3>

            {!user ? (
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-muted)", lineHeight: 1.7, marginBottom: "1rem" }}>
                  You must be signed in and have purchased this item to leave a review.
                </p>
                <a
                  href="/auth/login?redirect=/shop"
                  style={{ display: "inline-block", padding: "11px 24px", backgroundColor: "var(--color-gold)", color: "var(--color-foreground)", fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}
                >
                  Sign in to review
                </a>
              </div>
            ) : !canReview ? (
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-muted)", lineHeight: 1.7 }}>
                Reviews are only available to customers who have purchased and received this product.
              </p>
            ) : (
              <ReviewForm
                productId={productId}
                productTitle={productTitle}
                orderId={eligibleOrderId}
                existingReview={existingReview}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
