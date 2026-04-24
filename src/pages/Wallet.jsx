import { useState } from 'react';
import { useStore } from '../useStore';

const fmt = p => '₹' + (p/100).toLocaleString('en-IN',{maximumFractionDigits:0});

export default function Wallet() {
  const { balance, locked, addMoney } = useStore();
  const [amount,   setAmount]   = useState('500');
  const [method,   setMethod]   = useState('upi');
  const [upiId,    setUpiId]    = useState('');
  const [step,     setStep]     = useState('idle'); // idle|processing|success
  const [txns] = useState([
    { id:1, type:'credit', icon:'📲', title:'Added via GPay UPI', meta:'haxor@okaxis · Today 3:42 PM', amount:1000, status:'success' },
    { id:2, type:'debit',  icon:'🏏', title:'Bet — CSK win IPL?', meta:'IPL Market · Yesterday', amount:500, status:'pending' },
    { id:3, type:'credit', icon:'🏆', title:'Won — CSK beat MI', meta:'Match 34 · 2 days ago', amount:840, status:'success' },
    { id:4, type:'debit',  icon:'🏦', title:'Withdrawal to UPI', meta:'haxor@okaxis · 3 days ago', amount:2000, status:'success' },
    { id:5, type:'credit', icon:'💳', title:'Added via Debit Card', meta:'HDFC ••••4521 · 5 days ago', amount:2000, status:'success' },
  ]);

  async function pay() {
    setStep('processing');
    await new Promise(r => setTimeout(r, 2500));
    addMoney(parseFloat(amount) || 500);
    setStep('success');
    setTimeout(() => setStep('idle'), 2800);
  }

  const methods = [
    { id:'upi',  logo:'UPI', name:'UPI / GPay / PhonePe', desc:'Instant · No charges' },
    { id:'gpay', logo:'🟢',  name:'Google Pay', desc:'Tap & Pay via GPay app' },
    { id:'card', logo:'💳',  name:'Debit / Credit Card', desc:'Visa, RuPay, Mastercard' },
    { id:'net',  logo:'🏦',  name:'Net Banking', desc:'SBI, HDFC, ICICI, Axis +50' },
  ];

  return (
    <div style={{display:'flex',height:'100%',overflow:'hidden'}}>
      {/* LEFT */}
      <div style={{flex:1,overflowY:'auto',padding:'24px 28px'}}>
        {/* Wallet card */}
        <div style={{background:'linear-gradient(135deg,#1A1008,#0C1A12,#0D0D12)',border:'1px solid rgba(255,107,0,0.2)',borderRadius:'4px',padding:'32px',marginBottom:'20px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'-60px',right:'-60px',width:'200px',height:'200px',background:'radial-gradient(circle,rgba(255,107,0,0.12),transparent 70%)',pointerEvents:'none'}}/>
          <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',color:'rgba(245,240,232,0.35)',fontFamily:"'Rajdhani',sans-serif",marginBottom:'10px'}}>Available Balance</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'68px',lineHeight:1,marginBottom:'4px'}}>
            <span style={{color:'#FF6B00',fontSize:'44px'}}>₹</span>{(balance/100).toLocaleString('en-IN',{maximumFractionDigits:0})}
          </div>
          <div style={{fontSize:'13px',color:'rgba(245,240,232,0.35)',marginBottom:'28px'}}>🔒 {fmt(locked)} locked in active predictions</div>
          <div style={{display:'flex',gap:'12px'}}>
            {[['➕ Add Money','#FF6B00','#0C0B09',true],['🏦 Withdraw','rgba(15,183,96,0.12)','#0FB760',false]].map(([label,bg,color,primary]) => (
              <button key={label} style={{flex:1,padding:'13px',fontFamily:"'Rajdhani',sans-serif",fontSize:'15px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',background:bg,color,border:primary?'none':'1px solid rgba(15,183,96,0.3)',borderRadius:'2px',cursor:'pointer',boxShadow:primary?'0 4px 20px rgba(255,107,0,0.25)':'none'}}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px',marginBottom:'20px'}}>
          {[['Total Deposited','₹8,500','6 transactions'],['Total Winnings','+₹4,210','49.5% ROI'],['Withdrawn','₹8,870','4 transactions']].map(([l,v,s]) => (
            <div key={l} style={{background:'#181816',border:'1px solid rgba(245,240,232,0.07)',padding:'18px',borderRadius:'3px'}}>
              <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'rgba(245,240,232,0.35)',fontFamily:"'Rajdhani',sans-serif",marginBottom:'6px'}}>{l}</div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'26px',fontWeight:700,color:l.includes('Win')?'#0FB760':'#F0EBE0'}}>{v}</div>
              <div style={{fontSize:'12px',color:'rgba(245,240,232,0.3)',marginTop:'3px'}}>{s}</div>
            </div>
          ))}
        </div>

        {/* KYC */}
        <div style={{background:'rgba(74,158,255,0.06)',border:'1px solid rgba(74,158,255,0.2)',borderRadius:'3px',padding:'14px 18px',display:'flex',alignItems:'center',gap:'14px',marginBottom:'20px'}}>
          <span style={{fontSize:'26px'}}>🪪</span>
          <div style={{flex:1}}>
            <div style={{fontSize:'14px',fontWeight:600,fontFamily:"'Rajdhani',sans-serif",letterSpacing:'.5px',marginBottom:'2px'}}>Full KYC — ₹1,00,000 Wallet Limit</div>
            <div style={{fontSize:'12px',color:'rgba(245,240,232,0.4)'}}>Aadhaar + PAN verified · Withdrawals within 24hrs</div>
          </div>
          <button style={{background:'rgba(74,158,255,0.15)',border:'1px solid rgba(74,158,255,0.3)',color:'#4A9EFF',fontFamily:"'Rajdhani',sans-serif",fontSize:'13px',fontWeight:700,letterSpacing:'1px',padding:'8px 16px',borderRadius:'2px',cursor:'pointer',whiteSpace:'nowrap'}}>
            Manage KYC →
          </button>
        </div>

        {/* Transactions */}
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'16px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:'14px'}}>Transactions</div>
        <div style={{background:'#181816',border:'1px solid rgba(245,240,232,0.07)',borderRadius:'3px',overflow:'hidden'}}>
          {txns.map((t,i) => (
            <div key={t.id} style={{display:'flex',alignItems:'center',gap:'14px',padding:'14px 18px',borderBottom:i<txns.length-1?'1px solid rgba(245,240,232,0.05)':'none'}}>
              <div style={{width:'40px',height:'40px',borderRadius:'50%',background:t.type==='credit'?'rgba(15,183,96,0.12)':'rgba(255,107,0,0.1)',border:`1px solid ${t.type==='credit'?'rgba(15,183,96,0.2)':'rgba(255,107,0,0.2)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'17px',flexShrink:0}}>{t.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:'14px',fontWeight:500,marginBottom:'3px'}}>{t.title}</div>
                <div style={{fontSize:'12px',color:'rgba(245,240,232,0.35)'}}>{t.meta}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'17px',fontWeight:700,color:t.type==='credit'?'#0FB760':'#F0EBE0'}}>{t.type==='credit'?'+':'-'}₹{t.amount.toLocaleString('en-IN')}</div>
                <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:t.status==='success'?'#0FB760':t.status==='pending'?'#F5C518':'rgba(245,240,232,0.4)',marginTop:'2px'}}>{t.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Add Money */}
      <div style={{width:'340px',flexShrink:0,overflowY:'auto',padding:'20px 16px',borderLeft:'1px solid rgba(245,240,232,0.07)'}}>
        <div style={{background:'#181816',border:'1px solid rgba(245,240,232,0.07)',borderRadius:'3px',overflow:'hidden'}}>
          <div style={{padding:'16px 18px',borderBottom:'1px solid rgba(245,240,232,0.07)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'16px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase'}}>Add Money</span>
            <span style={{fontSize:'12px',color:'rgba(245,240,232,0.35)'}}>Instant · Secure</span>
          </div>
          <div style={{padding:'18px'}}>
            {/* Amount */}
            <div style={{position:'relative',marginBottom:'12px'}}>
              <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',fontFamily:"'Bebas Neue',sans-serif",fontSize:'26px',color:'#FF6B00',pointerEvents:'none'}}>₹</span>
              <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={{width:'100%',background:'rgba(245,240,232,0.04)',border:'1px solid rgba(245,240,232,0.14)',color:'#F0EBE0',fontFamily:"'Bebas Neue',sans-serif",fontSize:'34px',letterSpacing:'1px',padding:'14px 14px 14px 42px',outline:'none',borderRadius:'3px'}}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'6px',marginBottom:'20px'}}>
              {[100,500,1000,5000].map(v=>(
                <button key={v} onClick={()=>setAmount(String(v))} style={{padding:'9px 4px',background:'rgba(245,240,232,0.04)',border:`1px solid ${amount==v?'rgba(255,107,0,0.4)':'rgba(245,240,232,0.1)'}`,color:amount==v?'#FF6B00':'rgba(245,240,232,0.45)',fontFamily:"'Rajdhani',sans-serif",fontSize:'13px',fontWeight:700,borderRadius:'2px',cursor:'pointer',textAlign:'center'}}>
                  {v>=1000?'₹'+v/1000+'K':'₹'+v}
                </button>
              ))}
            </div>

            {/* Methods */}
            <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(245,240,232,0.35)',fontFamily:"'Rajdhani',sans-serif",marginBottom:'10px'}}>Payment Method</div>
            <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'16px'}}>
              {methods.map(m=>(
                <div key={m.id} onClick={()=>setMethod(m.id)} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 14px',background:'rgba(245,240,232,0.03)',border:`1.5px solid ${method===m.id?'#FF6B00':'rgba(245,240,232,0.09)'}`,borderRadius:'3px',cursor:'pointer',background:method===m.id?'rgba(255,107,0,0.06)':'rgba(245,240,232,0.03)',transition:'all .15s'}}>
                  <div style={{width:'46px',height:'30px',background:'#1E1E1C',borderRadius:'3px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Rajdhani',sans-serif",fontSize:m.logo==='UPI'?'11px':'17px',fontWeight:700,color:'rgba(245,240,232,0.6)',border:'1px solid rgba(245,240,232,0.1)',flexShrink:0}}>
                    {m.logo}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'14px',fontWeight:600,marginBottom:'1px'}}>{m.name}</div>
                    <div style={{fontSize:'11px',color:'rgba(245,240,232,0.35)'}}>{m.desc}</div>
                  </div>
                  <div style={{width:'16px',height:'16px',borderRadius:'50%',border:`2px solid ${method===m.id?'#FF6B00':'rgba(245,240,232,0.2)'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    {method===m.id && <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#FF6B00'}}/>}
                  </div>
                </div>
              ))}
            </div>

            {method==='upi' && (
              <input value={upiId} onChange={e=>setUpiId(e.target.value)} placeholder="yourname@okaxis / @ybl / @paytm" style={{width:'100%',background:'rgba(245,240,232,0.04)',border:'1px solid rgba(245,240,232,0.14)',color:'#F0EBE0',fontFamily:"'DM Sans',sans-serif",fontSize:'14px',padding:'12px 14px',outline:'none',borderRadius:'3px',marginBottom:'14px'}}/>
            )}

            {step === 'processing' ? (
              <div style={{textAlign:'center',padding:'16px 0'}}>
                <div style={{width:'44px',height:'44px',border:'3px solid rgba(255,107,0,0.15)',borderTop:'3px solid #FF6B00',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 12px'}}/>
                <div style={{fontSize:'14px',color:'rgba(245,240,232,0.5)'}}>Processing payment...</div>
              </div>
            ) : step === 'success' ? (
              <div style={{textAlign:'center',padding:'16px 0'}}>
                <div style={{fontSize:'36px',marginBottom:'8px'}}>🎉</div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'28px',color:'#0FB760',marginBottom:'4px'}}>₹{parseFloat(amount).toLocaleString('en-IN')} Added!</div>
                <div style={{fontSize:'13px',color:'rgba(245,240,232,0.4)'}}>Wallet updated instantly</div>
              </div>
            ) : (
              <button onClick={pay} style={{width:'100%',background:'linear-gradient(135deg,#FF6B00,#FF4500)',color:'#0C0B09',fontFamily:"'Rajdhani',sans-serif",fontSize:'17px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',padding:'16px',border:'none',borderRadius:'3px',cursor:'pointer',boxShadow:'0 4px 24px rgba(255,107,0,0.3)',marginBottom:'12px'}}>
                Pay ₹{parseFloat(amount)||0} Now →
              </button>
            )}

            <div style={{fontSize:'12px',color:'rgba(245,240,232,0.28)',textAlign:'center'}}>🔒 Secured by Razorpay · PCI DSS · 256-bit SSL</div>
          </div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}
