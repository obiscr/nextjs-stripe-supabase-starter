import ProductCard from './ProductCard';
import { ProductItem } from '@/lib/types';

interface ProductCategoryProps {
  title: string;
  description: string | null;
  icon: string | null;
  productItems: ProductItem[];
  purchasedItems: Set<string>;
  isLoggedIn: boolean;
  onPurchase: (priceId: string, itemId: string) => void;
}

const getIcon = (iconName: string | null) => {
  switch (iconName) {
    case 'crown':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3l4 6 4-6 4 6 4-6v13a2 2 0 01-2 2H7a2 2 0 01-2-2V3z" />
        </svg>
      );
    case 'cloud':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      );
    case 'code':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    default:
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
  }
};

export default function ProductCategory({
  title,
  description,
  icon,
  productItems,
  purchasedItems,
  isLoggedIn,
  onPurchase
}: ProductCategoryProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="flex items-center space-x-4">
          <div className="text-white">
            {getIcon(icon)}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <p className="text-blue-100">{description}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              isPurchased={purchasedItems.has(item.id)}
              isLoggedIn={isLoggedIn}
              onPurchase={onPurchase}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 