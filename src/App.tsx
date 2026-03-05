import { useEffect } from 'react';

import { http } from '@/lib/axios';

import './App.css';
import AppRouter from './routers';

function App() {
  useEffect(() => {
    const warmServer = async () => {
      for (let i = 0; i < 3; i++) {
        try {
          await http.get('/');
          break;
        } catch {
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    };

    warmServer();
  }, []);

  return <AppRouter />;
}

export default App;
