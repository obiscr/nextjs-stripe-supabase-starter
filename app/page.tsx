'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProductsSection from '@/components/ProductsSection';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ProductWithItems } from '@/lib/types';
import { User } from '@supabase/supabase-js';

export default function HomePage() {
  const [products, setProducts] = useState<ProductWithItems[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // Check user login status
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    // Load products from Supabase
    const loadProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_items (*)
          `)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error loading products:', error);
        } else {
          setProducts(data || []);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [supabase]);

  useEffect(() => {
    // Load purchased items from Supabase when user is logged in
    const loadPurchasedItems = async () => {
      if (!user) {
        setPurchasedItems(new Set());
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_purchases')
          .select('product_item_id')
          .eq('user_id', user.id)
          .eq('payment_status', 'completed');

        if (error) {
          console.error('Error loading purchased items:', error);
        } else {
          const purchasedItemIds = new Set(data.map(item => item.product_item_id));
          setPurchasedItems(purchasedItemIds);
        }
      } catch (error) {
        console.error('Error loading purchased items:', error);
      }
    };

    loadPurchasedItems();
  }, [user, supabase]);

  const handleAuth = async (email: string, password: string, mode: 'login' | 'register') => {
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw new Error(`Login failed: ${error.message}`);
      }
      
      return { success: true };
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw new Error(`Registration failed: ${error.message}`);
      } else {
        return { 
          success: true, 
          message: 'Registration successful! Please check your email for confirmation.' 
        };
      }
    }
  };

  const handlePurchase = async (priceId: string, itemId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          itemId,
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
      />
      
      <HeroSection />
      
      <ProductsSection 
        products={products}
        productsLoading={productsLoading}
        purchasedItems={purchasedItems}
        isLoggedIn={!!user}
        onPurchase={handlePurchase}
      />

      <AuthModal 
        isOpen={showAuthModal}
        onClose={handleCloseAuthModal}
        onAuth={handleAuth}
      />

      <Footer />
    </div>
  );
}