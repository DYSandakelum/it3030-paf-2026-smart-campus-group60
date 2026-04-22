import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

const AuthCallbackPage = () => {
  const [searchParams]  = useSearchParams();
  const { login }       = useAuth();
  const navigate        = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      api.get('/auth/me')
        .then((res) => {
          login(token, res.data.data);
          navigate('/dashboard', { replace: true });
        })
        .catch(() => {
          navigate('/login', { replace: true });
        });
    } else {
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12
          border-t-2 border-b-2 border-primary-600 mx-auto mb-4">
        </div>
        <p className="text-gray-500">Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;