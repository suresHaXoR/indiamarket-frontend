import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase';

const Store = createContext(null);

// ── Seed demo data ────────────────────────────────────────────────────────────
const DEMO_MARKETS = [
  { id:'m1', category:'ipl',      status:'open',     title:'Will CSK beat MI in Match 34?',       yesPrice:62, noPrice:38, totalVolume:428000,  closesAt:Date.now()+7200000   },
  { id:'m2', category:'ipl',      status:'open',     title:'Will CSK win IPL 2025?',              yesPrice:34, noPrice:66, totalVolume:4820000, closesAt:Date.now()+2592000000},
  { id:'m3', category:'ipl',      status:'open',     title:'Will Rohit score 50+ today?',         yesPrice:41, noPrice:59, totalVolume:190000,  closesAt:Date.now()+93600000  },
  { id:'m4', category:'ipl',      status:'open',     title:'Super Over tonight?',                 yesPrice:12, noPrice:88, totalVolume:84000,   closesAt:Date.now()+7200000   },
  { id:'m5', category:'election', status:'open',     title:'DMK wins 150+ seats in TN 2026?',     yesPrice:71, noPrice:29, totalVolume:1280000, closesAt:Date.now()+15552000000},
  { id:'m6', category:'election', status:'open',     title:'Will NDA win Bihar 2025?',            yesPrice:68, noPrice:32, totalVolume:890000,  closesAt:Date.now()+5184000000 },
  { id:'m7', category:'election', status:'resolved', title:'BJP wins Delhi 2025?',                yesPrice:73, noPrice:27, totalVolume:2200000, closesAt:Date.now()-86400000, outcome:'yes'},
];

export function StoreProvider({ children }) {
  const [user,      setUser]      = useState(null);   // { id, phone, name }
  const [balance,   setBalance]   = useState(384000); // paise
  const [locked,    setLocked]    = useState(56000);
  const [markets,   setMarkets]   = useState(DEMO_MARKETS);
  const [positions, setPositions] = useState([]);
  const [page,      setPage]      = useState('login'); // login|markets|wallet|portfolio
  const [activity,  setActivity]  = useState([]);

  // ── Supabase auth state ────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser({ id: data.session.user.id, phone: data.session.user.phone, name: 'User' });
        setPage('markets');
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser({ id: session.user.id, phone: session.user.phone, name: 'User' });
        setPage('markets');
      } else {
        setUser(null);
        setPage('login');
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // ── Supabase realtime: market price updates ────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('markets-rt')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'markets' }, ({ new: row }) => {
        setMarkets(prev => prev.map(m =>
          m.id === row.id
            ? { ...m, yesPrice: row.yes_price, noPrice: row.no_price, totalVolume: row.total_volume, status: row.status }
            : m
        ));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'positions' }, ({ new: row }) => {
        const mkt = markets.find(m => m.id === row.market_id);
        setActivity(prev => [{ side: row.side, market: mkt?.title || '—', amount: row.amount_paise / 100, time: new Date() }, ...prev].slice(0, 20));
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user]);

  // ── Simulate realtime in demo mode ────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => {
      setMarkets(prev => prev.map(m => {
        if (m.status !== 'open') return m;
        if (Math.random() > 0.35) return m;
        const delta = Math.floor(Math.random() * 5) - 2;
        const yes   = Math.max(5, Math.min(95, m.yesPrice + delta));
        return { ...m, yesPrice: yes, noPrice: 100 - yes, totalVolume: m.totalVolume + Math.floor(Math.random() * 8000) };
      }));
    }, 2200);
    return () => clearInterval(id);
  }, [user]);

  // ── Actions ───────────────────────────────────────────────────────────────
  function login(userData) {
    setUser(userData);
    setPage('markets');
  }

  function logout() {
    supabase.auth.signOut();
    setUser(null);
    setPage('login');
  }

  function placeBet(marketId, side, amountRupees) {
    const amt    = amountRupees * 100; // paise
    const market = markets.find(m => m.id === marketId);
    if (!market || balance < amt) return false;

    const price  = side === 'yes' ? market.yesPrice : market.noPrice;
    const payout = Math.floor(amountRupees / price * 100 * 0.97);

    setBalance(b => b - amt);
    setLocked(l => l + amt);

    const impact = Math.min(Math.floor(amountRupees / 200), 6);
    setMarkets(prev => prev.map(m => {
      if (m.id !== marketId) return m;
      const yes = side === 'yes' ? Math.min(95, m.yesPrice + impact) : Math.max(5, m.yesPrice - impact);
      return { ...m, yesPrice: yes, noPrice: 100 - yes, totalVolume: m.totalVolume + amt };
    }));

    const pos = { id: 'pos_' + Date.now(), marketId, marketTitle: market.title, side, amount: amountRupees, payout, status: 'open', createdAt: new Date() };
    setPositions(prev => [pos, ...prev]);
    setActivity(prev => [{ side, market: market.title, amount: amountRupees, time: new Date() }, ...prev].slice(0, 20));
    return true;
  }

  function resolveMarket(marketId, yesWins) {
    const outcome = yesWins ? 'yes' : 'no';
    setMarkets(prev => prev.map(m => m.id === marketId ? { ...m, status: 'resolved', outcome } : m));
    let won = 0;
    setPositions(prev => prev.map(p => {
      if (p.marketId !== marketId || p.status !== 'open') return p;
      if (p.side === outcome) { won += p.payout; return { ...p, status: 'won' }; }
      return { ...p, status: 'lost' };
    }));
    if (won > 0) { setBalance(b => b + won * 100); setLocked(l => Math.max(0, l - won * 100)); }
    return won;
  }

  function addMoney(amount) {
    setBalance(b => b + amount * 100);
  }

  return (
    <Store.Provider value={{ user, balance, locked, markets, positions, activity, page, setPage, login, logout, placeBet, resolveMarket, addMoney }}>
      {children}
    </Store.Provider>
  );
}

export function useStore() { return useContext(Store); }
