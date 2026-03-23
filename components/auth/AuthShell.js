import Link from "next/link";

/**
 * Shared wrapper for auth pages — brand header + centred card.
 */
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-background">
      {/* Brand */}
      <Link
        href="/"
        className="font-heading text-xl tracking-[0.22em] uppercase text-foreground mb-10 hover:text-gold transition-colors"
      >
        Aiefashion
      </Link>

      <div className="w-full max-w-md">
        {/* Decorative rule */}
        <div className="w-px h-8 bg-border mx-auto mb-8" />

        <div className="mb-8 text-center">
          <h1 className="font-heading text-2xl text-foreground mb-2">{title}</h1>
          {subtitle && (
            <p className="font-body text-sm text-muted">{subtitle}</p>
          )}
        </div>

        <div className="border border-border p-8">{children}</div>

        {footer && (
          <div className="mt-6 text-center font-body text-sm text-muted">{footer}</div>
        )}
      </div>
    </main>
  );
}
