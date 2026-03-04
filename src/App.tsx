import { useEffect } from 'react';

import { http } from '@/lib/axios';

import './App.css';
import AppRouter from './routers';

function App() {
  useEffect(() => {
    http.get('/').catch(() => {});
  }, []);

  return <AppRouter />;
}

export default App;
