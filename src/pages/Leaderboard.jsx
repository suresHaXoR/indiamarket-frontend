const leaders = [
  { rank:1, name:'Vishnu_Predict', handle:'@vishnu', profit:48200, wr:78, badge:'🔥 Hot' },
  { rank:2, name:'IPL_King_2025',  handle:'@iplking', profit:39100, wr:71, badge:'⚡ Sharp' },
  { rank:3, name:'Haxor',         handle:'@haxor',   profit:28400, wr:64, badge:'🆙 Rising' },
  { rank:4, name:'DmkFan_TN',     handle:'@dmkfan',  profit:21700, wr:62, badge:'' },
  { rank:5, name:'CSK_Always',    handle:'@cskfan',  profit:17300, wr:58, badge:'' },
  { rank:6, name:'PredictMaster', handle:'@pm99',    profit:12800, wr:55, badge:'' },
  { rank:7, name:'MarketWala',    handle:'@mwala',   profit:9400,  wr:52, badge:'' },
];

const cols = ['#F5C518','#C0C0C0','#CD7F32'];

export default function Leaderboard() {
  return (
    <div style={{flex:1,overflowY:'auto',padding:'24px 28px'}}>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'22px',letterSpacing:'1px',marginBottom:'20px'}}>🏆 Leaderboard</div>
      <div style={{background:'#181816',border:'1px solid rgba(245,240,232,0.07)',borderRadius:'3px',overflow:'hidden'}}>
        <div style={{display:'grid',gridTemplateColumns:'56px 1fr 140px 120px 100px',padding:'13px 22px',background:'rgba(255,107,0,0.07)',borderBottom:'1px solid rgba(255,107,0,0.18)',fontFamily:"'Rajdhani',sans-serif",fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(245,240,232,0.4)'}}>
          {['#','Predictor','Profit','Win Rate','Badge'].map(h=><span key={h}>{h}</span>)}
        </div>
        {leaders.map((l,i) => (
          <div key={l.rank} style={{display:'grid',gridTemplateColumns:'56px 1fr 140px 120px 100px',padding:'16px 22px',alignItems:'center',borderBottom:i<leaders.length-1?'1px solid rgba(245,240,232,0.04)':'none',background:l.name==='Haxor'?'rgba(255,107,0,0.05)':'transparent',transition:'background .15s'}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'24px',color:cols[i]||'rgba(245,240,232,0.4)'}}>{l.rank}</div>
            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'50%',background:`hsl(${l.rank*47},60%,40%)`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',sans-serif",fontSize:'14px',color:'#fff',border:l.name==='Haxor'?'2px solid #FF6B00':'2px solid rgba(245,240,232,0.1)',flexShrink:0}}>
                {l.name.slice(0,2).toUpperCase()}
              </div>
              <div>
                <div style={{fontSize:'15px',fontWeight:600,color:l.name==='Haxor'?'#FF6B00':'#F0EBE0'}}>{l.name}</div>
                <div style={{fontSize:'12px',color:'rgba(245,240,232,0.35)'}}>{l.handle}</div>
              </div>
            </div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'18px',fontWeight:700,color:'#0FB760'}}>+₹{l.profit.toLocaleString('en-IN')}</div>
            <div style={{fontSize:'15px',fontWeight:600,color:'rgba(245,240,232,0.6)'}}>{l.wr}%</div>
            <div style={{fontSize:'13px'}}>{l.badge}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
