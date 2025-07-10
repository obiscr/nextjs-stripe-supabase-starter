import { Database } from './database.types';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type Product = Tables<'products'>;
export type ProductItem = Tables<'product_items'>;
export type UserPurchase = Tables<'user_purchases'>;

export type ProductInsert = TablesInsert<'products'>;
export type ProductItemInsert = TablesInsert<'product_items'>;
export type UserPurchaseInsert = TablesInsert<'user_purchases'>;

export type ProductUpdate = TablesUpdate<'products'>;
export type ProductItemUpdate = TablesUpdate<'product_items'>;
export type UserPurchaseUpdate = TablesUpdate<'user_purchases'>;

export type ProductWithItems = Product & {
  product_items: ProductItem[];
};

export type UserPurchaseWithProduct = UserPurchase & {
  product_items: ProductItem & {
    products: Product;
  };
};

export type Json = Database['public']['Tables']['product_items']['Row']['features']; 