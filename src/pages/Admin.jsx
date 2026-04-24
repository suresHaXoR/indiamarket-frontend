import { useState } from 'react';
import { useStore } from '../useStore';

const S = {
  wrap:    { flex:1, overflowY:'auto', padding:'24px 28px', display:'flex', gap:'22px', alignItems:'flex-start' },
  col:     { flex:1, display:'flex', flexDirection:'column', gap:'16px' },
  rCol:    { width:'340px', flexShrink:0, display:'flex', flexDirection:'column', gap:'16px' },
  card:    { background:'#181816', border:'1px solid rgba(245,240,232,0.07)', borderRadius:'3px', overflow:'hidden' },
  hdr:     (accent) => ({ padding:'13px 18px', borderBottom:'1px solid rgba(245,240,232,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between', background: accent ? 'rgba(255,107,0,0.06)' : 'transparent' }),
  htitle:  (accent) => ({ fontFamily:"'Rajdhani',sans-serif", fontSize:'15px', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', color: accent ? '#FF6B00' : '#F0EBE0' }),
  body:    { padding:'18px' },
  lbl:     { fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'rgba(245,240,232,0.35)', fontFamily:"'Rajdhani',sans-serif", marginBottom:'7px' },
  inp:     { width:'100%', background:'rgba(245,240,232,0.04)', border:'1px solid rgba(245,240,232,0.12)', color:'#F0EBE0', fontFamily:"'DM Sans',sans-serif", fontSize:'14px', padding:'11px 14px', outline:'none', borderRadius:'2px', marginBottom:'14px', transition:'border-color .2s' },
  sel:     { width:'100%', background:'rgba(245,240,232,0.04)', border:'1px solid rgba(245,240,232,0.12)', color:'#F0EBE0', fontFamily:"'DM Sans',sans-serif", fontSize:'14px', padding:'11px 14px', outline:'none', borderRadius:'2px', marginBottom:'14px', cursor:'pointer' },
  btn:     (color='#FF6B00', outline=false) => ({ padding:'12px 18px', background: outline ? 'transparent' : color==='green' ? 'linear-gradient(135deg,#07924A,#0FB760)' : color==='red' ? 'linear-gradient(135deg,#CC2020,#FF4040)' : 'linear-gradient(135deg,#FF6B00,#FF4500)', color: outline ? color : '#0C0B09', fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:'14px', letterSpacing:'1px', textTransform:'uppercase', border: outline ? `1px solid ${color}` : 'none', borderRadius:'2px', cursor:'pointer', transition:'all .15s' }),
  statVal: (c='#F0EBE0') => ({ fontFamily:"'Bebas Neue',sans-serif", fontSize:'32px', letterSpacing:'1px', color:c }),
  statLbl: { fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'rgba(245,240,232,0.35)', fontFamily:"'Rajdhani',sans-serif", marginBottom:'4px' },
  mrow:    (hi) => ({ display:'flex', alignItems:'center', gap:'12px', padding:'14px 18px', borderBottom:'1px solid rgba(245,240,232,0.05)', background: hi ? 'rgba(255,107,0,0.04)' : 'transparent', transition:'background .15s' }),
  tag:     (c) => ({ fontFamily:"'Rajdhani',sans-serif", fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', padding:'3px 9px', borderRadius:'1px', background:`rgba(${c},0.12)`, color:`rgb(${c})`, border:`1px solid rgba(${c},0.25)` }),
};

export default function Admin() {
  const { markets, resolveMarket } = useStore();
  const [tab,       setTab]       = useState('overview'); // overview | create | resolve | users
  const [creating,  setCreating]  = useState(false);
  const [toast,     setToast]     = useState('');
  const [form, setForm] = useState({
    title: '', description: '', category: 'ipl',
    closesAt: '', yesLabel: 'YES', noLabel: 'NO'
  });

  const openMkts    = markets.filter(m => m.status === 'open');
  const resolvedMkts = markets.filter(m => m.status === 'resolved');
  const totalVol    = markets.reduce((s, m) => s + m.totalVolume, 0);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function createMarket() {
    if (!form.title || !form.closesAt) { showToast('❌ Title and close date required'); return; }
    setCreating(true);
    // Real: await apiFetch('/api/markets', { method:'POST', body: JSON.stringify(form) });
    await new Promise(r => setTimeout(r, 800));
    showToast('✅ Market created! (demo)');
    setForm({ title:'', description:'', category:'ipl', closesAt:'', yesLabel:'YES', noLabel:'NO' });
    setCreating(false);
  }

  function doResolve(id, yesWins) {
    const won = resolveMarket(id, yesWins);
    showToast(`🏆 Resolved — ${yesWins ? 'YES' : 'NO'} won${won > 0 ? ` · ₹${won} paid out` : ''}`);
  }

  const tabs = [
    { id:'overview', label:'📊 Overview' },
    { id:'create',   label:'➕ Create Market' },
    { id:'resolve',  label:'✅ Resolve' },
    { id:'users',    label:'👥 Users' },
  ];

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Admin topbar */}
      <div style={{ padding:'14px 28px', borderBottom:'1px solid rgba(255,107,0,0.15)', background:'rgba(255,107,0,0.04)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'20px', color:'#FF6B00', letterSpacing:'1px' }}>⚙️ Admin Panel</span>
          <div style={{ display:'flex', gap:'4px' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ ...S.btn(), padding:'7px 14px', fontSize:'13px', background: tab===t.id ? '#FF6B00' : 'transparent', color: tab===t.id ? '#0C0B09' : 'rgba(245,240,232,0.5)', border: tab===t.id ? 'none' : '1px solid rgba(245,240,232,0.1)' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'rgba(245,240,232,0.4)' }}>
          <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#0FB760', animation:'pulse 1.5s ease infinite' }}/>
          Admin Access
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'24px 28px' }}>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'24px' }}>
              {[
                ['Open Markets',    openMkts.length,              '#F5C518'],
                ['Total Volume',    '₹'+(totalVol/100).toLocaleString('en-IN',{maximumFractionDigits:0}), '#0FB760'],
                ['Resolved',        resolvedMkts.length,          '#8888A0'],
                ['Platform Fees',   '₹'+(totalVol/100*0.03).toFixed(0), '#FF6B00'],
              ].map(([l,v,c]) => (
                <div key={l} style={S.card}>
                  <div style={S.body}>
                    <div style={S.statLbl}>{l}</div>
                    <div style={S.statVal(c)}>{v}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* All markets table */}
            <div style={S.card}>
              <div style={S.hdr(true)}>
                <span style={S.htitle(true)}>All Markets</span>
                <button onClick={() => setTab('create')} style={{ ...S.btn(), padding:'7px 14px', fontSize:'12px' }}>+ New Market</button>
              </div>
              <div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 90px 90px 100px 110px', padding:'11px 18px', background:'rgba(255,255,255,0.03)', fontFamily:"'Rajdhani',sans-serif", fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'rgba(245,240,232,0.35)', borderBottom:'1px solid rgba(245,240,232,0.06)' }}>
                  {['Market','Cat','YES','Vol','Status','Action'].map(h => <span key={h}>{h}</span>)}
                </div>
                {markets.map((m, i) => (
                  <div key={m.id} style={S.mrow(false)}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'14px', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.title}</div>
                    </div>
                    <div><span style={S.tag(m.category==='ipl'?'255,107,0':'15,183,96')}>{m.category}</span></div>
                    <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:'16px', color:'#0FB760' }}>{m.yesPrice}¢</div>
                    <div style={{ fontSize:'13px', color:'rgba(245,240,232,0.5)' }}>₹{(m.totalVolume/100).toLocaleString('en-IN',{maximumFractionDigits:0})}</div>
                    <div>
                      <span style={S.tag(m.status==='open'?'15,183,96':m.status==='resolved'?'136,136,160':'255,107,0')}>
                        {m.status}
                      </span>
                    </div>
                    <div style={{ display:'flex', gap:'6px' }}>
                      {m.status === 'open' && (
                        <>
                          <button onClick={() => { setTab('resolve'); }} style={{ ...S.btn('green'), padding:'5px 10px', fontSize:'11px' }}>✓</button>
                          <button style={{ ...S.btn('red'), padding:'5px 10px', fontSize:'11px' }}>✕</button>
                        </>
                      )}
                      {m.status === 'resolved' && <span style={{ fontSize:'12px', color:'rgba(245,240,232,0.3)' }}>{m.outcome?.toUpperCase()} won</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── CREATE MARKET ── */}
        {tab === 'create' && (
          <div style={{ maxWidth:'640px' }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'28px', letterSpacing:'1px', marginBottom:'20px' }}>➕ Create New Market</div>
            <div style={S.card}>
              <div style={S.body}>
                <div style={S.lbl}>Category</div>
                <select value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))} style={S.sel}>
                  <option value="ipl">🏏 IPL 2025</option>
                  <option value="election">🗳️ Elections</option>
                  <option value="cricket">🏏 Cricket (Other)</option>
                </select>

                <div style={S.lbl}>Market Question</div>
                <input value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))}
                  placeholder="Will CSK beat MI in Match 42?" style={S.inp} />

                <div style={S.lbl}>Description (optional)</div>
                <textarea value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))}
                  placeholder="More details about the market..." rows={3}
                  style={{ ...S.inp, resize:'vertical', fontFamily:"'DM Sans',sans-serif" }} />

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                  <div>
                    <div style={S.lbl}>Closes At</div>
                    <input type="datetime-local" value={form.closesAt} onChange={e => setForm(p=>({...p,closesAt:e.target.value}))} style={S.inp} />
                  </div>
                  <div>
                    <div style={S.lbl}>Tags (comma separated)</div>
                    <input placeholder="ipl, csk, mi, match" style={S.inp} />
                  </div>
                </div>

                {/* Preview */}
                {form.title && (
                  <div style={{ background:'rgba(255,107,0,0.05)', border:'1px solid rgba(255,107,0,0.2)', borderRadius:'3px', padding:'16px', marginBottom:'16px' }}>
                    <div style={{ fontSize:'11px', color:'#FF6B00', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', fontFamily:"'Rajdhani',sans-serif", marginBottom:'8px' }}>Preview</div>
                    <div style={{ fontSize:'15px', fontWeight:500, marginBottom:'12px' }}>{form.title}</div>
                    <div style={{ display:'flex', gap:'12px' }}>
                      <div style={{ flex:1, background:'rgba(15,183,96,0.1)', border:'1px solid rgba(15,183,96,0.25)', padding:'10px', borderRadius:'2px', textAlign:'center', fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:'14px', color:'#0FB760' }}>YES — 50¢</div>
                      <div style={{ flex:1, background:'rgba(255,64,64,0.08)', border:'1px solid rgba(255,64,64,0.2)', padding:'10px', borderRadius:'2px', textAlign:'center', fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:'14px', color:'#FF4040' }}>NO — 50¢</div>
                    </div>
                  </div>
                )}

                <button onClick={createMarket} disabled={creating || !form.title || !form.closesAt}
                  style={{ ...S.btn(), width:'100%', padding:'15px', fontSize:'16px', letterSpacing:'2px', opacity: creating||!form.title||!form.closesAt ? 0.5 : 1, cursor: creating ? 'not-allowed' : 'pointer' }}>
                  {creating ? 'Creating...' : '🚀 Publish Market'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── RESOLVE ── */}
        {tab === 'resolve' && (
          <div style={{ maxWidth:'700px' }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'28px', letterSpacing:'1px', marginBottom:'20px' }}>✅ Resolve Markets</div>
            {openMkts.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 0', color:'rgba(245,240,232,0.3)' }}>
                <div style={{ fontSize:'36px', marginBottom:'12px' }}>🎯</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'24px', marginBottom:'8px' }}>No Open Markets</div>
                <div style={{ fontSize:'14px' }}>Create some markets first.</div>
              </div>
            ) : openMkts.map((m, i) => (
              <div key={m.id} style={{ ...S.card, marginBottom:'12px' }}>
                <div style={{ padding:'18px 20px' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'16px', marginBottom:'16px' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', fontFamily:"'Rajdhani',sans-serif", color: m.category==='ipl'?'#FF6B00':'#0FB760', marginBottom:'5px' }}>
                        {m.category === 'ipl' ? '🏏 IPL' : '🗳️ Election'}
                      </div>
                      <div style={{ fontSize:'16px', fontWeight:500, lineHeight:1.35 }}>{m.title}</div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'22px', color:'#0FB760' }}>
                        ₹{(m.totalVolume/100).toLocaleString('en-IN',{maximumFractionDigits:0})}
                      </div>
                      <div style={{ fontSize:'11px', color:'rgba(245,240,232,0.35)' }}>total volume</div>
                    </div>
                  </div>

                  {/* Price bar */}
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
                    <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'22px', color:'#0FB760' }}>{m.yesPrice}¢</span>
                    <div style={{ flex:1, height:'8px', background:'rgba(245,240,232,0.05)', borderRadius:'2px', overflow:'hidden', position:'relative' }}>
                      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:m.yesPrice+'%', background:'linear-gradient(90deg,#07924A,#0FB760)', borderRadius:'2px' }}/>
                      <div style={{ position:'absolute', right:0, top:0, bottom:0, width:m.noPrice+'%', background:'linear-gradient(270deg,#CC2020,#FF4040)', borderRadius:'2px' }}/>
                    </div>
                    <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'22px', color:'#FF4040' }}>{m.noPrice}¢</span>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                    <button onClick={() => doResolve(m.id, true)} style={{ ...S.btn('green'), padding:'14px', fontSize:'16px', letterSpacing:'1.5px', boxShadow:'0 4px 18px rgba(15,183,96,0.22)' }}>
                      ✅ YES Wins
                    </button>
                    <button onClick={() => doResolve(m.id, false)} style={{ ...S.btn('red'), padding:'14px', fontSize:'16px', letterSpacing:'1.5px', boxShadow:'0 4px 18px rgba(255,64,64,0.18)' }}>
                      ❌ NO Wins
                    </button>
                  </div>

                  <div style={{ marginTop:'10px', display:'flex', gap:'10px' }}>
                    <button style={{ flex:1, ...S.btn('', true), padding:'9px', fontSize:'12px', color:'rgba(245,240,232,0.4)', border:'1px solid rgba(245,240,232,0.1)' }}>
                      🔒 Close (no more bets)
                    </button>
                    <button style={{ flex:1, ...S.btn('', true), padding:'9px', fontSize:'12px', color:'#FF4040', border:'1px solid rgba(255,64,64,0.2)' }}>
                      🚫 Cancel & Refund All
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'28px', letterSpacing:'1px', marginBottom:'20px' }}>👥 Users</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', marginBottom:'24px' }}>
              {[['Total Users','18,420','#F0EBE0'],['KYC Verified','11,240','#0FB760'],['Active Today','3,820','#FF6B00']].map(([l,v,c]) => (
                <div key={l} style={S.card}>
                  <div style={S.body}>
                    <div style={S.statLbl}>{l}</div>
                    <div style={S.statVal(c)}>{v}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={S.card}>
              <div style={S.hdr(false)}><span style={S.htitle(false)}>Recent Users</span></div>
              {[
                { name:'Haxor',         phone:'98765****10', kyc:'verified', bal:'₹3,840', joined:'Today' },
                { name:'Vishnu_P',      phone:'91234****56', kyc:'verified', bal:'₹12,200', joined:'2 days ago' },
                { name:'CSK_Fan',       phone:'87654****21', kyc:'basic',    bal:'₹400', joined:'3 days ago' },
                { name:'PredictKing',   phone:'99887****34', kyc:'pending',  bal:'₹0', joined:'1 week ago' },
              ].map((u, i) => (
                <div key={u.phone} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 18px', borderBottom:i<3?'1px solid rgba(245,240,232,0.05)':'none' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:`hsl(${i*80},55%,35%)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Bebas Neue',sans-serif", fontSize:'14px', color:'#fff', flexShrink:0 }}>{u.name.slice(0,2).toUpperCase()}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'14px', fontWeight:600 }}>{u.name}</div>
                    <div style={{ fontSize:'12px', color:'rgba(245,240,232,0.35)' }}>{u.phone} · Joined {u.joined}</div>
                  </div>
                  <span style={S.tag(u.kyc==='verified'?'15,183,96':u.kyc==='basic'?'245,197,24':'255,107,0')}>{u.kyc}</span>
                  <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:'16px', color:'#F0EBE0' }}>{u.bal}</div>
                  <button style={{ ...S.btn('', true), padding:'6px 12px', fontSize:'12px', color:'rgba(245,240,232,0.4)', border:'1px solid rgba(245,240,232,0.1)' }}>View</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', bottom:'24px', left:'50%', transform:'translateX(-50%)', background:'#181816', border:'1px solid rgba(15,183,96,0.4)', borderLeft:'4px solid #0FB760', padding:'13px 24px', borderRadius:'3px', fontSize:'14px', fontWeight:600, zIndex:999, boxShadow:'0 8px 32px rgba(0,0,0,.6)', whiteSpace:'nowrap' }}>
          {toast}
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}
