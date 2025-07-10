import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (email: string, password: string, mode: 'login' | 'register') => Promise<{ success: boolean; message?: string }>;
}

export default function AuthModal({ isOpen, onClose, onAuth }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setMessage(null);
    
    try {
      const result = await onAuth(email, password, authMode);
      
      if (result.success) {
        if (result.message) {
          setMessage({ text: result.message, type: 'success' });
        }
        
        if (authMode === 'login') {
          setEmail('');
          setPassword('');
          onClose();
        } else {
          setEmail('');
          setPassword('');
        }
      }
    } catch (error: unknown) {
      setMessage({ text: error instanceof Error ? error.message : 'An error occurred', type: 'error' });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setAuthMode('login');
    setMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">
            {authMode === 'login' ? 'Login' : 'Register'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
          </div>
          
          <button
            type="submit"
            disabled={authLoading}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
              authLoading
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {authLoading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Processing...
              </>
            ) : (
              authMode === 'login' ? 'Login' : 'Register'
            )}
          </button>


          {message && (
            <div className={`text-sm p-3 rounded-md ${
              message.type === 'error' 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message.text}
            </div>
          )}
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'register' : 'login');
              setMessage(null);
            }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {authMode === 'login' ? 'No account? Click to register' : 'Already have an account? Click to login'}
          </button>
        </div>
      </div>
    </div>
  );
} 