import ProductCategory from './ProductCategory';
import LoadingSpinner from './LoadingSpinner';
import { ProductWithItems } from '@/lib/types';

interface ProductsSectionProps {
  products: ProductWithItems[];
  productsLoading: boolean;
  purchasedItems: Set<string>;
  isLoggedIn: boolean;
  onPurchase: (priceId: string, itemId: string) => void;
}

export default function ProductsSection({
  products,
  productsLoading,
  purchasedItems,
  isLoggedIn,
  onPurchase
}: ProductsSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[calc(100vh-396px)]">
      {productsLoading ? (
        <LoadingSpinner message="Loading products..." />
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products available at the moment.</p>
          <p className="text-gray-500 text-sm mt-2">Please check back later or contact support.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {products.map((product) => (
            <ProductCategory
              key={product.id}
              title={product.name}
              description={product.description}
              icon={product.icon}
              productItems={product.product_items}
              purchasedItems={purchasedItems}
              isLoggedIn={isLoggedIn}
              onPurchase={onPurchase}
            />
          ))}
        </div>
      )}
    </section>
  );
} 