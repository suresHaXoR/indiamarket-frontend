import { useStore } from '../useStore';

const fmt = p => '₹' + (p/100).toLocaleString('en-IN',{maximumFractionDigits:0});

export default function Layout({ children }) {
  const { user, balance, locked, page, setPage, logout } = useStore();

  const nav = [
    { id:'markets',     icon:'📊', label:'Markets'     },
    { id:'wallet',      icon:'💰', label:'Wallet'       },
    { id:'portfolio',   icon:'💼', label:'Portfolio'    },
    { id:'leaderboard', icon:'🏆', label:'Leaderboard' },
    { id:'kyc',         icon:'🪪', label:'KYC'          },
    { id:'admin',       icon:'⚙️', label:'Admin'        },
  ];

  return (
    <div style={{display:'flex',height:'100vh',overflow:'hidden'}}>
      {/* SIDEBAR */}
      <aside style={{width:'220px',background:'#111110',borderRight:'1px solid rgba(245,240,232,0.07)',display:'flex',flexDirection:'column',flexShrink:0}}>
        {/* Tricolor */}
        <div style={{display:'flex',height:'3px'}}>
          <div style={{flex:1,background:'#FF6B00'}}/>
          <div style={{flex:1,background:'rgba(245,240,232,0.7)'}}/>
          <div style={{flex:1,background:'#138808'}}/>
        </div>

        {/* Logo */}
        <div style={{padding:'20px 20px 16px',borderBottom:'1px solid rgba(245,240,232,0.07)'}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'24px',letterSpacing:'2px',background:'linear-gradient(90deg,#FF6B00,#F5C518)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            India<span style={{WebkitTextFillColor:'#0FB760'}}>Market</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'6px',marginTop:'6px'}}>
            <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#FF4040',animation:'pulse 1.5s ease infinite'}}/>
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'11px',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'#FF6060'}}>Live</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:'10px 0'}}>
          {nav.map(({ id, icon, label }) => (
            <div key={id} onClick={() => setPage(id)} style={{
              display:'flex',alignItems:'center',gap:'10px',padding:'12px 20px',
              fontFamily:"'Rajdhani',sans-serif",fontSize:'15px',fontWeight:600,letterSpacing:'.5px',
              color: page===id ? '#F0EBE0' : 'rgba(245,240,232,0.4)',
              borderLeft: page===id ? '3px solid #FF6B00' : '3px solid transparent',
              background: page===id ? 'rgba(255,107,0,0.07)' : 'transparent',
              cursor:'pointer',transition:'all .15s'
            }}>
              <span style={{fontSize:'16px',width:'20px',textAlign:'center'}}>{icon}</span>
              {label}
            </div>
          ))}
        </nav>

        {/* Wallet */}
        <div style={{margin:'0 12px 12px',background:'linear-gradient(135deg,rgba(255,107,0,0.1),rgba(245,197,24,0.05))',border:'1px solid rgba(255,107,0,0.2)',padding:'14px',borderRadius:'3px'}}>
          <div style={{fontSize:'10px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(245,240,232,0.35)',fontFamily:"'Rajdhani',sans-serif",marginBottom:'3px'}}>Balance</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'28px',letterSpacing:'1px'}}>
            <span style={{color:'#FF6B00',fontSize:'20px'}}>₹</span>{(balance/100).toLocaleString('en-IN',{maximumFractionDigits:0})}
          </div>
          <div style={{fontSize:'11px',color:'rgba(245,240,232,0.3)',marginTop:'2px'}}>🔒 {fmt(locked)} locked</div>
        </div>

        {/* User + logout */}
        <div style={{padding:'12px 16px',borderTop:'1px solid rgba(245,240,232,0.07)',display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'34px',height:'34px',borderRadius:'50%',background:'linear-gradient(135deg,#FF6B00,#F5C518)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',sans-serif",fontSize:'14px',color:'#0C0B09',flexShrink:0}}>
            {(user?.name||'U').slice(0,2).toUpperCase()}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:'13px',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.name||'User'}</div>
            <div style={{fontSize:'11px',color:'rgba(245,240,232,0.3)'}}>@{(user?.name||'user').toLowerCase()}</div>
          </div>
          <div onClick={logout} style={{fontSize:'14px',cursor:'pointer',opacity:.5,transition:'opacity .15s'}} title="Logout">🚪</div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        {children}
      </main>

      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.7)}}`}</style>
    </div>
  );
}
