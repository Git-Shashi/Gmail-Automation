import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleCallback } from '@/services/authService';
import { setCredentials } from '@/store/slices/authSlice';

export default function CallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Authentication failed. Please try again.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (token) {
      // Token is already a JWT from backend, store it with the correct key
      localStorage.setItem('gmail_auth_token', token);
      
      // Fetch user info with the token
      import('@/services/authService').then(({ getCurrentUser }) => {
        return getCurrentUser();
      })
        .then((user) => {
          // Store credentials in Redux
          dispatch(setCredentials({
            user: user,
            token: token
          }));
          navigate('/dashboard');
        })
        .catch((err) => {
          console.error('Failed to fetch user info:', err);
          setError('Failed to complete authentication. Redirecting...');
          setTimeout(() => navigate('/login'), 3000);
        });
    } else {
      setError('Invalid callback. Redirecting...');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-4">
        {error ? (
          <>
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{error}</h2>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Completing authentication...</h2>
            <p className="text-gray-600">Please wait while we set up your account</p>
          </>
        )}
      </div>
    </div>
  );
}
