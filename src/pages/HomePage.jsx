import { useAuth } from 'contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 這個頁面也需要掛載 useAuth，根據 isAuthenticated 的不同狀態導引到適合的頁面
const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos');
    } else {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);
};

export default HomePage;
