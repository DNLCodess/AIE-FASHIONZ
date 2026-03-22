/**
 * Injects a JSON-LD structured data script into the page <head>.
 * Pass a plain object — it will be JSON.stringify'd safely.
 *
 * Usage:
 *   <JsonLd data={{ "@context": "https://schema.org", "@type": "...", ... }} />
 *
 * @param {{ data: object }} props
 */
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
