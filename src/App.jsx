import './index.css';
import { StoreProvider, useStore } from './useStore';
import Layout from './components/Layout';
import Login       from './pages/Login';
import Markets     from './pages/Markets';
import Wallet      from './pages/Wallet';
import Portfolio   from './pages/Portfolio';
import Leaderboard from './pages/Leaderboard';
import Admin       from './pages/Admin';
import KYC         from './pages/KYC';

function AppInner() {
  const { user, page } = useStore();

  if (!user) return <Login />;

  const pages = { markets: Markets, wallet: Wallet, portfolio: Portfolio, leaderboard: Leaderboard, admin: Admin, kyc: KYC };
  const Page  = pages[page] || Markets;

  return (
    <Layout>
      <Page />
    </Layout>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  );
}
