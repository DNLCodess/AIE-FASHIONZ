import ProductForm from "@/components/admin/ProductForm";

export const metadata = { title: "New Product | Admin" };

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">New Product</h1>
        <p className="font-body text-sm text-muted mt-0.5">Add a new product to the store</p>
      </div>
      <ProductForm apiPath="/api/admin/products" method="POST" />
    </div>
  );
}
