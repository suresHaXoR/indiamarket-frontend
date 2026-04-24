import { useStore } from '../useStore';

export default function Portfolio() {
  const { positions, markets } = useStore();

  const won   = positions.filter(p => p.status === 'won');
  const lost  = positions.filter(p => p.status === 'lost');
  const open  = positions.filter(p => p.status === 'open');
  const inv   = positions.reduce((s,p) => s + p.amount, 0);
  const pnl   = won.reduce((s,p) => s + (p.payout - p.amount), 0) - lost.reduce((s,p) => s + p.amount, 0);
  const wr    = (won.length + lost.length) ? Math.round(won.length / (won.length + lost.length) * 100) : null;

  const stats = [
    ['Total Invested', '₹'+inv.toLocaleString('en-IN'), '#F0EBE0'],
    ['P & L', (pnl>=0?'+':'')+'₹'+Math.abs(pnl).toLocaleString('en-IN'), pnl>=0?'#0FB760':'#FF4040'],
    ['Open Positions', open.length, '#F5C518'],
    ['Win Rate', wr!==null?wr+'%':'—', '#0FB760'],
  ];

  const sections = [
    ['🟡 Open Positions', open, 'open'],
    ['🏆 Won', won, 'won'],
    ['❌ Lost', lost, 'lost'],
  ];

  return (
    <div style={{flex:1,overflowY:'auto',padding:'24px 28px'}}>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'22px',letterSpacing:'1px',marginBottom:'20px'}}>💼 My Portfolio</div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px',marginBottom:'28px'}}>
        {stats.map(([l,v,c]) => (
          <div key={l} style={{background:'#181816',border:'1px solid rgba(245,240,232,0.07)',padding:'20px',borderRadius:'3px'}}>
            <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(245,240,232,0.35)',fontFamily:"'Rajdhani',sans-serif",marginBottom:'6px'}}>{l}</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'28px',fontWeight:700,color:c}}>{v}</div>
          </div>
        ))}
      </div>

      {positions.length === 0 ? (
        <div style={{textAlign:'center',padding:'80px 0',color:'rgba(245,240,232,0.3)'}}>
          <div style={{fontSize:'48px',marginBottom:'16px'}}>📊</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'28px',marginBottom:'8px'}}>No Positions Yet</div>
          <div style={{fontSize:'14px'}}>Go to Markets and place your first bet!</div>
        </div>
      ) : sections.map(([title, list, status]) => list.length > 0 && (
        <div key={status} style={{marginBottom:'28px'}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'16px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:'12px',display:'flex',alignItems:'center',gap:'10px'}}>
            {title} <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'20px',color:'#FF6B00'}}>{list.length}</span>
          </div>
          <div style={{background:'#181816',border:'1px solid rgba(245,240,232,0.07)',borderRadius:'3px',overflow:'hidden'}}>
            {list.map((p,i) => {
              const mkt = markets.find(m => m.id === p.marketId);
              const roi = p.status==='won' ? Math.round((p.payout-p.amount)/p.amount*100) : p.status==='lost' ? -100 : null;
              return (
                <div key={p.id} style={{display:'flex',alignItems:'center',gap:'14px',padding:'16px 20px',borderBottom:i<list.length-1?'1px solid rgba(245,240,232,0.05)':'none'}}>
                  <div style={{width:'40px',height:'40px',borderRadius:'50%',background:p.side==='yes'?'rgba(15,183,96,0.14)':'rgba(255,64,64,0.1)',border:`1px solid ${p.side==='yes'?'rgba(15,183,96,0.28)':'rgba(255,64,64,0.22)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',sans-serif",fontSize:'13px',color:p.side==='yes'?'#0FB760':'#FF4040',flexShrink:0}}>
                    {p.side.toUpperCase()}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:'14px',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:'3px'}}>{p.marketTitle}</div>
                    <div style={{fontSize:'12px',color:'rgba(245,240,232,0.35)',display:'flex',gap:'12px'}}>
                      <span>₹{p.amount} bet</span>
                      <span>Potential ₹{p.payout}</span>
                      {p.status==='open' && mkt && <span style={{color:'rgba(245,240,232,0.5)'}}>{mkt.yesPrice}¢/{mkt.noPrice}¢ now</span>}
                    </div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'17px',fontWeight:700,color:p.status==='won'?'#0FB760':p.status==='lost'?'#FF4040':'#F0EBE0'}}>
                      {p.status==='won'?'+₹'+p.payout:p.status==='lost'?'-₹'+p.amount:'₹'+p.amount}
                    </div>
                    {roi!==null && <div style={{fontSize:'12px',color:roi>=0?'#0FB760':'#FF4040',fontWeight:600}}>{roi>=0?'+':''}{roi}% ROI</div>}
                    <div style={{fontSize:'10px',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:p.status==='open'?'#F5C518':p.status==='won'?'#0FB760':'rgba(245,240,232,0.3)',marginTop:'2px'}}>{p.status}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
