import { useState, useEffect, useRef } from 'react';
import { useStore } from '../useStore';

const fmt    = p => '₹' + (p/100).toLocaleString('en-IN',{maximumFractionDigits:0});
const fmtR   = r => '₹' + Number(r).toLocaleString('en-IN',{maximumFractionDigits:0});
const sleep  = ms => new Promise(r => setTimeout(r, ms));

function timeLeft(ms) {
  const d = ms - Date.now();
  if (d < 0)         return 'Closed';
  if (d < 3600000)   return Math.floor(d/60000) + 'm';
  if (d < 86400000)  return Math.floor(d/3600000) + 'h';
  return Math.floor(d/86400000) + 'd';
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, []);
  return (
    <div style={{position:'fixed',bottom:'24px',right:'24px',background:'#181816',border:'1px solid rgba(15,183,96,0.35)',borderLeft:'4px solid #0FB760',padding:'14px 20px',borderRadius:'3px',zIndex:999,boxShadow:'0 8px 32px rgba(0,0,0,.6)',maxWidth:'300px',animation:'slideIn .3s cubic-bezier(.34,1.56,.64,1)'}}>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:'15px',marginBottom:'3px'}}>{msg.title}</div>
      <div style={{fontSize:'12px',color:'rgba(245,240,232,0.45)'}}>{msg.sub}</div>
      <style>{`@keyframes slideIn{from{transform:translateX(120%)}to{transform:translateX(0)}}`}</style>
    </div>
  );
}

function MarketCard({ market, onBet, prevPrice }) {
  const flashing = useRef(false);
  const [flash, setFlash] = useState('');

  useEffect(() => {
    if (!prevPrice || prevPrice === market.yesPrice) return;
    const dir = market.yesPrice > prevPrice ? 'up' : 'dn';
    setFlash(dir);
    const t = setTimeout(() => setFlash(''), 600);
    return () => clearTimeout(t);
  }, [market.yesPrice]);

  const res  = market.status === 'resolved';
  const live = market.status === 'open' && (market.closesAt - Date.now()) < 4*3600000;
  const tl   = timeLeft(market.closesAt);

  return (
    <div style={{
      background: flash==='up' ? 'rgba(15,183,96,0.04)' : flash==='dn' ? 'rgba(255,64,64,0.04)' : '#181816',
      border: `1px solid ${flash==='up' ? 'rgba(15,183,96,0.4)' : flash==='dn' ? 'rgba(255,64,64,0.4)' : 'rgba(245,240,232,0.07)'}`,
      borderRadius:'3px', overflow:'hidden', transition:'all .3s',marginBottom:'10px'
    }}>
      {/* Head */}
      <div style={{padding:'16px 18px 12px',display:'flex',gap:'12px',alignItems:'flex-start'}}>
        <div style={{width:'9px',height:'9px',borderRadius:'50%',background:market.category==='ipl'?'#FF6B00':'#0FB760',marginTop:'5px',flexShrink:0}}/>
        <div style={{flex:1}}>
          <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',fontFamily:"'Rajdhani',sans-serif",color:market.category==='ipl'?'#FF6B00':'#0FB760',marginBottom:'4px'}}>
            {market.category==='ipl'?'🏏 IPL 2025':'🗳️ Elections'}
          </div>
          <div style={{fontSize:'15px',fontWeight:500,lineHeight:1.35,marginBottom:'8px'}}>{market.title}</div>
          <div style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap',fontSize:'12px'}}>
            {res  && <span style={{background:'rgba(245,240,232,0.06)',border:'1px solid rgba(245,240,232,0.12)',color:'rgba(245,240,232,0.5)',padding:'2px 9px',borderRadius:'1px',fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:'10px',letterSpacing:'1.5px',textTransform:'uppercase'}}>Resolved</span>}
            {!res && live && <span style={{background:'rgba(255,50,50,0.12)',border:'1px solid rgba(255,50,50,0.25)',color:'#FF5555',padding:'2px 9px',borderRadius:'1px',fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:'10px',letterSpacing:'1.5px',textTransform:'uppercase'}}>● Live</span>}
            {!res && !live && <span style={{background:'rgba(15,183,96,0.1)',border:'1px solid rgba(15,183,96,0.22)',color:'#0FB760',padding:'2px 9px',borderRadius:'1px',fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:'10px',letterSpacing:'1.5px',textTransform:'uppercase'}}>Open</span>}
            <span style={{color:'rgba(245,240,232,0.4)'}}>Vol <strong style={{color:'#F0EBE0'}}>{fmt(market.totalVolume)}</strong></span>
            <span style={{color:(market.closesAt-Date.now())<3600000?'#FF9D00':'rgba(245,240,232,0.4)'}}>⏱ {tl}</span>
          </div>
        </div>
      </div>

      {/* Resolved outcome */}
      {res && <div style={{padding:'0 18px 12px',fontSize:'13px',color:market.outcome==='yes'?'#0FB760':'#FF4040'}}>
        Outcome: <strong>{market.outcome?.toUpperCase()} WON ✓</strong>
      </div>}

      {/* Price bar */}
      {!res && (
        <div style={{padding:'0 18px 12px',display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{minWidth:'54px',textAlign:'center'}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'28px',color:'#0FB760',lineHeight:1,transition:'color .3s'}}>{market.yesPrice}¢</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'11px',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'rgba(15,183,96,0.7)',marginTop:'2px'}}>YES</div>
          </div>
          <div style={{flex:1,height:'10px',background:'rgba(245,240,232,0.05)',borderRadius:'2px',overflow:'hidden',position:'relative'}}>
            <div style={{position:'absolute',left:0,top:0,bottom:0,width:market.yesPrice+'%',background:'linear-gradient(90deg,#07924A,#0FB760)',borderRadius:'2px',transition:'width .4s cubic-bezier(.4,0,.2,1)'}}/>
            <div style={{position:'absolute',right:0,top:0,bottom:0,width:market.noPrice+'%',background:'linear-gradient(270deg,#CC2020,#FF4040)',borderRadius:'2px',transition:'width .4s cubic-bezier(.4,0,.2,1)'}}/>
          </div>
          <div style={{minWidth:'54px',textAlign:'center'}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'28px',color:'#FF4040',lineHeight:1,transition:'color .3s'}}>{market.noPrice}¢</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'11px',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'rgba(255,64,64,0.7)',marginTop:'2px'}}>NO</div>
          </div>
        </div>
      )}

      {/* Bet buttons */}
      {!res && (
        <div style={{padding:'0 18px 16px',display:'flex',gap:'9px'}}>
          {[['yes','Buy YES @ '+market.yesPrice+'¢','rgba(15,183,96,0.14)','#0FB760','rgba(15,183,96,0.28)'],
            ['no','Buy NO @ '+market.noPrice+'¢','rgba(255,64,64,0.09)','#FF4040','rgba(255,64,64,0.22)']].map(([side,label,bg,color,border]) => (
            <button key={side} onClick={() => onBet(market.id, side)} style={{flex:1,padding:'11px',fontFamily:"'Rajdhani',sans-serif",fontSize:'13px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',border:`1px solid ${border}`,background:bg,color,borderRadius:'2px',cursor:'pointer',transition:'all .15s'}}>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Markets() {
  const { markets, balance, positions, activity, placeBet, resolveMarket } = useStore();
  const [cat,      setCat]      = useState('all');
  const [slip,     setSlip]     = useState(null); // { marketId, side }
  const [amount,   setAmount]   = useState('500');
  const [toast,    setToast]    = useState(null);
  const [prevPrices, setPrev]   = useState({});

  // Track price history for flash effect
  useEffect(() => {
    setPrev(p => {
      const next = {...p};
      markets.forEach(m => { if (!next[m.id]) next[m.id] = m.yesPrice; });
      return next;
    });
    const timer = setInterval(() => {
      setPrev(p => {
        const next = {...p};
        markets.forEach(m => { next[m.id] = m.yesPrice; });
        return next;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [markets]);

  const filtered = markets.filter(m => cat === 'all' || m.category === cat);
  const market   = slip ? markets.find(m => m.id === slip.marketId) : null;
  const price    = market ? (slip.side === 'yes' ? market.yesPrice : market.noPrice) : 50;
  const amt      = parseFloat(amount) || 0;
  const payout   = Math.floor(amt / price * 100 * 0.97);
  const profit   = payout - amt;

  function openSlip(id, side) { setSlip({ marketId:id, side }); setAmount('500'); }

  function doBet() {
    if (!slip || amt < 10 || amt*100 > balance) return;
    const ok = placeBet(slip.marketId, slip.side, amt);
    if (ok) {
      setToast({ title:`✅ Bet placed!`, sub:`₹${amt} on ${slip.side.toUpperCase()} — "${market?.title?.slice(0,30)}..."` });
      setSlip(null);
    }
  }

  function doResolve(yesWins) {
    const selId = document.getElementById('adminSel')?.value;
    if (!selId) return;
    const won = resolveMarket(selId, yesWins);
    setToast({ title:`🏆 Market Resolved — ${yesWins?'YES':'NO'} Won`, sub: won > 0 ? `You won ₹${won}! 🎉` : 'Better luck next time' });
  }

  return (
    <div style={{display:'flex',height:'100%',overflow:'hidden'}}>
      {/* Markets list */}
      <div style={{flex:1,overflowY:'auto',padding:'20px 22px',borderRight:'1px solid rgba(245,240,232,0.07)'}}>
        {/* Topbar */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'18px',position:'sticky',top:0,background:'#0C0B09',paddingBottom:'14px',zIndex:5}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'22px',letterSpacing:'1px'}}>📊 Live Markets</div>
          <div style={{display:'flex',gap:'6px'}}>
            {[['all','All'],['ipl','🏏 IPL'],['election','🗳️ Elections']].map(([id,label]) => (
              <button key={id} onClick={()=>setCat(id)} style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'13px',fontWeight:700,padding:'6px 14px',border:'1px solid',borderColor:cat===id?(id==='election'?'#0FB760':'#FF6B00'):'rgba(245,240,232,0.07)',color:cat===id?(id==='election'?'#0FB760':'#FF6B00'):'rgba(245,240,232,0.4)',background:cat===id?(id==='election'?'rgba(15,183,96,0.08)':'rgba(255,107,0,0.08)'):'transparent',borderRadius:'2px',cursor:'pointer',letterSpacing:'.5px'}}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {filtered.map(m => <MarketCard key={m.id} market={m} onBet={openSlip} prevPrice={prevPrices[m.id]} />)}
      </div>

      {/* Right panel */}
      <div style={{width:'340px',flexShrink:0,overflowY:'auto',padding:'18px 16px',display:'flex',flexDirection:'column',gap:'16px'}}>

        {/* Live Activity */}
        <div style={{background:'#181816',border:'1px solid rgba(245,240,232,0.07)',borderRadius:'3px',overflow:'hidden'}}>
          <div style={{padding:'11px 16px',borderBottom:'1px solid rgba(245,240,232,0.07)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'14px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase'}}>⚡ Live Activity</span>
            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'18px',color:'#FF6B00'}}>{activity.length}</span>
          </div>
          <div style={{maxHeight:'120px',overflowY:'auto'}}>
            {activity.length === 0 && <div style={{padding:'16px',textAlign:'center',fontSize:'13px',color:'rgba(245,240,232,0.3)',fontStyle:'italic'}}>Waiting for bets...</div>}
            {activity.map((a,i) => (
              <div key={i} style={{padding:'8px 16px',borderBottom:'1px solid rgba(245,240,232,0.05)',display:'flex',alignItems:'center',gap:'10px',fontSize:'13px'}}>
                <span style={{background:a.side==='yes'?'rgba(15,183,96,0.14)':'rgba(255,64,64,0.1)',color:a.side==='yes'?'#0FB760':'#FF4040',border:`1px solid ${a.side==='yes'?'rgba(15,183,96,0.28)':'rgba(255,64,64,0.22)'}`,fontFamily:"'Rajdhani',sans-serif",fontSize:'11px',fontWeight:700,letterSpacing:'1px',padding:'2px 7px',borderRadius:'1px'}}>{a.side.toUpperCase()}</span>
                <span style={{flex:1,color:'rgba(245,240,232,0.4)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.market?.slice(0,28)}...</span>
                <span style={{fontWeight:600,whiteSpace:'nowrap'}}>₹{a.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bet slip */}
        <div style={{background:'#181816',border:'1px solid rgba(245,240,232,0.07)',borderRadius:'3px',overflow:'hidden'}}>
          <div style={{padding:'13px 16px',borderBottom:'1px solid rgba(245,240,232,0.07)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'15px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase'}}>🎯 Bet Slip</span>
            {slip && <span onClick={()=>setSlip(null)} style={{fontSize:'12px',color:'rgba(245,240,232,0.4)',cursor:'pointer',fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>Clear</span>}
          </div>
          <div style={{padding:'16px'}}>
            {!slip ? (
              <div style={{textAlign:'center',padding:'24px 0',color:'rgba(245,240,232,0.3)',fontSize:'14px'}}>
                <div style={{fontSize:'28px',marginBottom:'8px'}}>🏏</div>
                Click <strong style={{color:'#F0EBE0'}}>Buy YES / NO</strong> to bet
              </div>
            ) : (
              <>
                <div style={{fontSize:'14px',fontWeight:500,lineHeight:1.35,marginBottom:'14px'}}>{market?.title}</div>
                <div style={{display:'flex',gap:'8px',marginBottom:'16px'}}>
                  {['yes','no'].map(s => (
                    <div key={s} onClick={()=>setSlip(p=>({...p,side:s}))} style={{flex:1,padding:'10px',textAlign:'center',fontFamily:"'Rajdhani',sans-serif",fontSize:'14px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer',borderRadius:'2px',border:`2px solid ${slip.side===s?(s==='yes'?'#0FB760':'#FF4040'):'rgba(245,240,232,0.12)'}`,color:s==='yes'?'#0FB760':'#FF4040',background:slip.side===s?(s==='yes'?'rgba(15,183,96,0.15)':'rgba(255,64,64,0.12)'):'transparent',transition:'all .15s'}}>
                      {s.toUpperCase()} {s==='yes'?market?.yesPrice:market?.noPrice}¢
                    </div>
                  ))}
                </div>
                <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(245,240,232,0.35)',fontFamily:"'Rajdhani',sans-serif",marginBottom:'8px'}}>Amount</div>
                <div style={{position:'relative',marginBottom:'10px'}}>
                  <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',fontFamily:"'Bebas Neue',sans-serif",fontSize:'22px',color:'#FF6B00',pointerEvents:'none'}}>₹</span>
                  <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={{width:'100%',background:'rgba(245,240,232,0.04)',border:'1px solid rgba(245,240,232,0.14)',color:'#F0EBE0',fontFamily:"'Bebas Neue',sans-serif",fontSize:'28px',letterSpacing:'1px',padding:'12px 12px 12px 34px',outline:'none',borderRadius:'3px'}} />
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'5px',marginBottom:'14px'}}>
                  {[100,500,1000,2000].map(v => (
                    <button key={v} onClick={()=>setAmount(String(v))} style={{padding:'7px',background:'rgba(245,240,232,0.04)',border:`1px solid ${amount==v?'rgba(255,107,0,0.4)':'rgba(245,240,232,0.1)'}`,color:amount==v?'#FF6B00':'rgba(245,240,232,0.5)',fontFamily:"'Rajdhani',sans-serif",fontSize:'12px',fontWeight:700,borderRadius:'2px',cursor:'pointer'}}>
                      {v>=1000?'₹'+v/1000+'K':'₹'+v}
                    </button>
                  ))}
                </div>
                {amt > 0 && (
                  <div style={{background:'rgba(245,240,232,0.03)',border:'1px solid rgba(245,240,232,0.07)',borderRadius:'3px',padding:'12px 14px',marginBottom:'14px'}}>
                    {[['Potential Payout','₹'+payout.toLocaleString('en-IN'),false],['Profit if wins',(profit>=0?'+':'')+'₹'+Math.abs(profit).toLocaleString('en-IN'),true],['ROI',Math.round(profit/amt*100)+'%',false]].map(([l,v,g]) => (
                      <div key={l} style={{display:'flex',justifyContent:'space-between',marginBottom:'5px',fontSize:'13px'}}>
                        <span style={{color:'rgba(245,240,232,0.4)'}}>{l}</span>
                        <span style={{fontWeight:600,color:g?'#0FB760':'#F0EBE0'}}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={doBet} disabled={amt<10||amt*100>balance} style={{width:'100%',padding:'15px',fontFamily:"'Rajdhani',sans-serif",fontSize:'16px',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',border:'none',borderRadius:'3px',cursor:amt<10||amt*100>balance?'not-allowed':'pointer',background:slip.side==='yes'?'linear-gradient(135deg,#07924A,#0FB760)':'linear-gradient(135deg,#CC2020,#FF4040)',color:'#fff',boxShadow:slip.side==='yes'?'0 4px 18px rgba(15,183,96,0.22)':'0 4px 18px rgba(255,64,64,0.18)',opacity:amt<10||amt*100>balance?.5:1,marginBottom:'10px',transition:'all .15s'}}>
                  Buy {slip.side.toUpperCase()} @ {price}¢
                </button>
                <div style={{fontSize:'12px',color:'rgba(245,240,232,0.3)',textAlign:'center'}}>Balance: <strong style={{color:'#F0EBE0'}}>{fmt(balance)}</strong></div>
              </>
            )}
          </div>
        </div>

        {/* Admin resolve */}
        <div style={{background:'#181816',border:'1px solid rgba(255,107,0,0.18)',borderRadius:'3px',overflow:'hidden'}}>
          <div style={{padding:'10px 14px',background:'rgba(255,107,0,0.06)',borderBottom:'1px solid rgba(255,107,0,0.12)',fontFamily:"'Rajdhani',sans-serif",fontSize:'12px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#FF6B00'}}>⚙️ Admin — Resolve</div>
          <div style={{padding:'12px 14px'}}>
            <select id="adminSel" style={{width:'100%',background:'rgba(245,240,232,0.04)',border:'1px solid rgba(245,240,232,0.14)',color:'#F0EBE0',fontFamily:"'DM Sans',sans-serif",fontSize:'13px',padding:'9px 10px',outline:'none',borderRadius:'2px',marginBottom:'10px',cursor:'pointer'}}>
              {markets.filter(m=>m.status==='open').map(m=><option key={m.id} value={m.id}>{m.title.slice(0,44)}...</option>)}
            </select>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
              {[['yes','✅ YES Wins','rgba(15,183,96,0.14)','#0FB760','rgba(15,183,96,0.28)'],['no','❌ NO Wins','rgba(255,64,64,0.09)','#FF4040','rgba(255,64,64,0.22)']].map(([side,label,bg,color,border]) => (
                <button key={side} onClick={()=>doResolve(side==='yes')} style={{padding:'10px',fontFamily:"'Rajdhani',sans-serif",fontSize:'13px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',border:`1px solid ${border}`,background:bg,color,borderRadius:'2px',cursor:'pointer'}}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast} onClose={()=>setToast(null)} />}
    </div>
  );
}
