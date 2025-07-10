import { ProductItem } from '@/lib/types';

interface ProductCardProps {
  item: ProductItem;
  isPurchased: boolean;
  isLoggedIn: boolean;
  onPurchase: (priceId: string, itemId: string) => void;
}

export default function ProductCard({ item, isPurchased, isLoggedIn, onPurchase }: ProductCardProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  return (
    <div
      className={`flex flex-col relative bg-gray-50 rounded-lg p-6 border-2 transition-all ${
        item.popular ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      {item.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-4">
        <h4 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h4>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {formatPrice(item.price)}
        </div>
        <p className="text-gray-600 text-sm">{item.description}</p>
        {item.recurring_interval && (
          <p className="text-gray-500 text-xs mt-1">
            Billed {item.recurring_interval}
          </p>
        )}
      </div>
      
      <ul className="space-y-2 mb-6 flex-1">
        {Array.isArray(item.features) && item.features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-gray-600">{String(feature)}</span>
          </li>
        ))}
      </ul>
      
      <div className="flex items-center justify-between">
        <button
          onClick={() => onPurchase(item.id, item.custom_id || item.id)}
          disabled={isPurchased}
          className={`flex flex-row items-center justify-center flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
            isPurchased
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : !isLoggedIn
              ? 'bg-gray-600 text-white hover:bg-gray-700'
              : item.popular
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-800 text-white hover:bg-gray-900'
          }`}
        >
          {isPurchased ? (
            <>
              <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="ml-2">Purchased</span>
            </>
          ) : !isLoggedIn ? (
            <>
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4M4.5 7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7zM8 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"/>
                </svg>
              </span>
              <span>Login to purchase</span>
            </>
          ) : (
            <span>Buy Now</span>
          )}
        </button>
      </div>
    </div>
  );
} 