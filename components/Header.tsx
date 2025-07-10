import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Header({ user, onLogin, onLogout }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showUserMenu && !target.closest('#user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center justify-center gap-2">
            <a href="https://obiscr.com" target="_blank" rel="noopener noreferrer">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 22.125C20.799 22.125 25.5 18.935 25.5 15C25.5 11.065 20.799 7.875 15 7.875C9.20101 7.875 4.5 11.065 4.5 15C4.5 18.935 9.20101 22.125 15 22.125Z" fill="white"/>
                <path d="M27.1039 16.3736C26.701 16.3736 26.2529 16.1907 25.9834 15.7776C22.5322 10.6966 18.721 7.9971 14.9551 7.9971C11.1892 7.9971 7.42325 10.6966 3.97206 15.7787C3.56791 16.4186 2.71676 16.5563 2.08972 16.1444C1.46145 15.7325 1.32673 14.8623 1.73088 14.2212C5.80909 8.2725 10.2486 5.25 14.9538 5.25C19.6616 5.25 24.1439 8.2713 28.1792 14.2212C28.5833 14.8623 28.4487 15.6862 27.8204 16.1444C27.6118 16.2941 27.361 16.3743 27.1039 16.3736Z" fill="url(#paint0_linear_201_2)"/>
                <path d="M14.9563 24.75C10.2486 24.75 5.81031 21.7287 1.73087 15.7787C1.53125 15.4736 1.45717 15.1038 1.52396 14.7457C1.59076 14.3878 1.79331 14.0691 2.08971 13.8556C2.23693 13.7551 2.40278 13.6848 2.57759 13.6488C2.7524 13.6127 2.93268 13.6117 3.10789 13.6458C3.2831 13.6798 3.44976 13.7482 3.59812 13.847C3.74649 13.9458 3.87361 14.073 3.97204 14.2212C7.42443 19.3033 11.2344 22.0042 15.0004 22.0042C18.7663 22.0042 22.5322 19.3033 26.0287 14.2212C26.4328 13.5814 27.284 13.4437 27.9122 13.8556C28.5393 14.2675 28.674 15.1377 28.2711 15.7787C24.1463 21.7274 19.708 24.75 14.9563 24.75Z" fill="url(#paint1_linear_201_2)"/>
                <path d="M20.1202 11.998L18.8478 13.254L18.7758 13.3266L18.7331 13.3706C18.7038 13.3913 18.6691 13.4017 18.629 13.4017C18.5864 13.4017 18.5464 13.3862 18.5143 13.3603L18.4904 13.337L18.4183 13.2671L17.3166 12.1767L17.2579 12.1197L17.2126 12.0756C17.1859 12.0368 17.1698 11.9876 17.1698 11.9384C17.1698 11.8943 17.1859 11.8556 17.2126 11.8244L17.2312 11.8037L17.3005 11.7364L18.5784 10.4751C18.4423 10.2135 17.9195 10.0892 17.642 10.1099C17.1859 10.1436 16.7164 10.2912 16.2335 10.7704C16.2149 10.7911 16.1935 10.8118 16.1749 10.8299C15.5186 11.524 15.3879 12.4564 15.6547 13.3111C15.6733 13.3473 15.6893 13.3913 15.6973 13.4302C15.7267 13.5726 15.6866 13.6943 15.5906 13.7798L14.5795 14.7225C14.2648 14.4118 14.2195 14.3703 14.2195 14.3703C14.1661 14.3185 14.0594 14.2849 13.966 14.3392L13.8087 14.4325C13.2031 13.8342 12.9469 13.5933 12.8643 13.3033C12.7789 13.0003 12.8563 12.5962 12.9363 12.446C13.003 12.3269 13.2111 12.2155 13.3872 12.2026L13.6166 12.4305C13.6699 12.4823 13.7526 12.4823 13.8059 12.4305L14.6302 11.6173C14.6836 11.5655 14.6836 11.48 14.6302 11.4282L13.2991 10.1151C13.2457 10.0633 13.1604 10.0633 13.1097 10.1151L12.2854 10.9283C12.232 10.9802 12.232 11.0657 12.2854 11.1174L12.3734 11.2055C12.3734 11.3324 12.3547 11.5292 12.2481 11.6354C12.0826 11.7986 11.7546 11.6095 11.5411 11.7571C11.3304 11.9021 11.0636 12.1352 10.8929 12.301C10.7248 12.4668 10.0792 13.1246 9.61777 14.2331C9.1563 15.3416 9.51105 16.3697 9.76185 16.6391C9.8952 16.7815 10.138 16.9266 10.0953 16.6572C10.0526 16.3853 9.98325 15.4425 10.3006 15.0566C10.6181 14.6708 11.037 14.3548 11.5812 14.3289C12.104 14.303 12.4054 14.4765 13.0831 15.1447L13.0083 15.2794C12.9604 15.3674 12.987 15.4788 13.0403 15.5306C13.0403 15.5306 13.0804 15.572 13.3632 15.8517L10.7702 18.2655C10.338 18.6358 10.3621 19.3144 10.7622 19.7158C11.1677 20.1096 11.8586 20.138 12.2347 19.7107L14.673 17.1571C15.9828 18.5116 17.1619 19.9386 17.1619 19.9386C17.2152 19.9904 17.3005 19.9904 17.3512 19.9386L18.6824 18.6256C18.7358 18.5738 18.7358 18.4909 18.6824 18.4365C18.6824 18.4365 17.2099 17.2528 15.828 15.9449L16.775 14.9531C16.8631 14.8572 16.9858 14.8184 17.1298 14.8469C17.1698 14.8547 17.2126 14.8727 17.2498 14.8909C18.1142 15.155 19.0585 15.0256 19.7575 14.3781C19.7788 14.36 19.7974 14.3392 19.8188 14.3185C20.3017 13.8419 20.4511 13.3758 20.4858 12.9251C20.5124 12.6506 20.3923 12.1404 20.1202 11.998Z" fill="url(#paint2_linear_201_2)"/>
                <defs>
                  <linearGradient id="paint0_linear_201_2" x1="1.5011" y1="10.8143" x2="28.409" y2="10.8143" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#00BFFF"/>
                    <stop offset="100%" stop-color="#EE82EE"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear_201_2" x1="1.5" y1="19.1854" x2="28.5" y2="19.1854" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#EE82EE"/>
                    <stop offset="100%" stop-color="#00BFFF"/>
                  </linearGradient>
                  <linearGradient id="paint2_linear_201_2" x1="9.39367" y1="11.8656" x2="20.4894" y2="18.2318" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#F62F8A"/>
                    <stop offset="50%" stop-color="#7257F0"/>
                    <stop offset="100%" stop-color="#0ABDE9"/>
                  </linearGradient>
                </defs>
              </svg>

            </a>
            <h1 className="text-2xl font-bold text-gray-900">Next.js Stripe Supabase Starter</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* GitHub Link */}
            <a
              href="https://github.com/obiscr/nextjs-stripe-supabase-starter"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              title="View on GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            
            {user ? (
              <div className="relative" id="user-menu">
                {/* User avatar button */}
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <span className="text-white text-sm font-semibold">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </button>
                
                {/* Dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User information */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                          </span>
                          <span className="text-xs text-gray-500">{user.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu items */}
                    <div className="py-1">
                      {/* Logout button */}
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 