import { useState } from 'react';

const S = {
  wrap:   { flex:1, overflowY:'auto', padding:'32px 40px' },
  card:   { background:'#181816', border:'1px solid rgba(245,240,232,0.07)', borderRadius:'4px', padding:'28px', marginBottom:'20px', maxWidth:'600px' },
  lbl:    { fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'rgba(245,240,232,0.35)', fontFamily:"'Rajdhani',sans-serif", marginBottom:'7px' },
  inp:    (err) => ({ width:'100%', background:'rgba(245,240,232,0.04)', border:`1px solid ${err?'rgba(255,64,64,0.5)':'rgba(245,240,232,0.12)'}`, color:'#F0EBE0', fontFamily:"'DM Mono',monospace", fontSize:'15px', padding:'13px 16px', outline:'none', borderRadius:'2px', marginBottom:'6px', letterSpacing:'1px', textTransform:'uppercase', transition:'border-color .2s' }),
  hint:   { fontSize:'12px', color:'rgba(245,240,232,0.3)', marginBottom:'18px' },
  err:    { fontSize:'12px', color:'#FF6666', marginBottom:'12px' },
  btn:    (disabled) => ({ padding:'14px 24px', background:disabled?'#1E1E1C':'linear-gradient(135deg,#FF6B00,#FF4500)', color:disabled?'rgba(245,240,232,0.25)':'#0C0B09', fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:'15px', letterSpacing:'1.5px', textTransform:'uppercase', border:'none', borderRadius:'2px', cursor:disabled?'not-allowed':'pointer', transition:'all .15s', boxShadow:disabled?'none':'0 4px 20px rgba(255,107,0,0.25)' }),
};

const STEPS = [
  { id:'basic', label:'Basic KYC', desc:'PAN Card', limit:'₹10,000 wallet', icon:'🪪' },
  { id:'full',  label:'Full KYC',  desc:'Aadhaar + PAN', limit:'₹1,00,000 wallet', icon:'🔐' },
];

export default function KYC() {
  const [step,    setStep]   = useState('select'); // select | pan | aadhaar | selfie | done
  const [kyc,     setKyc]    = useState('pending'); // pending | basic | verified
  const [pan,     setPan]    = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [dob,     setDob]    = useState('');
  const [loading, setLoading] = useState(false);
  const [err,     setErr]    = useState('');
  const [type,    setType]   = useState('full'); // basic | full

  const panValid     = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan.trim());
  const aadhaarValid = /^\d{12}$/.test(aadhaar.replace(/\s/g,''));

  async function submitPan() {
    if (!panValid) { setErr('Invalid PAN. Format: ABCDE1234F'); return; }
    setLoading(true); setErr('');
    // Real: await apiFetch('/api/kyc/pan', { method:'POST', body: JSON.stringify({ pan, dob }) });
    // Digio / HyperVerge API call happens on backend
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    if (type === 'basic') { setKyc('basic'); setStep('done'); }
    else setStep('aadhaar');
  }

  async function submitAadhaar() {
    if (!aadhaarValid) { setErr('Enter a valid 12-digit Aadhaar number'); return; }
    setLoading(true); setErr('');
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setStep('selfie');
  }

  async function submitSelfie() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setKyc('verified');
    setStep('done');
  }

  const kycColors = { pending:'#F5C518', basic:'#4A9EFF', verified:'#0FB760' };

  return (
    <div style={S.wrap}>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'22px', letterSpacing:'1px', marginBottom:'6px' }}>🪪 KYC Verification</div>
      <p style={{ fontSize:'14px', color:'rgba(245,240,232,0.4)', marginBottom:'28px', maxWidth:'500px', lineHeight:1.6 }}>
        Required by RBI guidelines to accept payments. Verified users get higher wallet limits and faster withdrawals.
      </p>

      {/* Current status */}
      <div style={{ ...S.card, display:'flex', alignItems:'center', gap:'16px', borderColor:`rgba(${kyc==='verified'?'15,183,96':kyc==='basic'?'74,158,255':'245,197,24'},0.25)` }}>
        <div style={{ fontSize:'36px' }}>{kyc==='verified'?'✅':kyc==='basic'?'🔵':'⏳'}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:'18px', fontWeight:700, color: kycColors[kyc] }}>
            {kyc==='verified'?'Full KYC Complete':kyc==='basic'?'Basic KYC Complete':'KYC Pending'}
          </div>
          <div style={{ fontSize:'13px', color:'rgba(245,240,232,0.4)', marginTop:'3px' }}>
            {kyc==='verified'?'Wallet limit: ₹1,00,000 · Instant withdrawals':kyc==='basic'?'Wallet limit: ₹10,000 · Upgrade for higher limits':'No wallet limit set · Complete KYC to deposit'}
          </div>
        </div>
        {kyc !== 'verified' && (
          <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:'13px', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', padding:'7px 16px', background:'rgba(255,107,0,0.1)', border:'1px solid rgba(255,107,0,0.25)', color:'#FF6B00', borderRadius:'2px', cursor:'pointer' }} onClick={() => setStep('select')}>
            Complete Now
          </div>
        )}
      </div>

      {/* Step: select type */}
      {step === 'select' && kyc !== 'verified' && (
        <div style={{ maxWidth:'600px' }}>
          <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:'16px', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', marginBottom:'14px' }}>Choose Verification Level</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'20px' }}>
            {STEPS.map(s => (
              <div key={s.id} onClick={() => setType(s.id)} style={{ ...S.card, cursor:'pointer', border:`1.5px solid ${type===s.id?'#FF6B00':'rgba(245,240,232,0.07)'}`, background: type===s.id?'rgba(255,107,0,0.06)':'#181816', padding:'22px', marginBottom:0, transition:'all .15s' }}>
                <div style={{ fontSize:'32px', marginBottom:'12px' }}>{s.icon}</div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:'17px', fontWeight:700, marginBottom:'4px' }}>{s.label}</div>
                <div style={{ fontSize:'13px', color:'rgba(245,240,232,0.5)', marginBottom:'10px' }}>{s.desc}</div>
                <div style={{ fontSize:'12px', fontWeight:700, color:'#0FB760', fontFamily:"'Rajdhani',sans-serif" }}>{s.limit}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setStep('pan')} style={{ ...S.btn(false) }}>
            Start Verification →
          </button>
        </div>
      )}

      {/* Step: PAN */}
      {step === 'pan' && (
        <div style={S.card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(255,107,0,0.15)', border:'2px solid #FF6B00', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Bebas Neue',sans-serif", fontSize:'16px', color:'#FF6B00' }}>1</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'24px', letterSpacing:'1px' }}>PAN Card Verification</div>
          </div>

          <div style={S.lbl}>PAN Number</div>
          <input value={pan} onChange={e => setPan(e.target.value.toUpperCase().slice(0,10))}
            placeholder="ABCDE1234F" style={S.inp(!pan||panValid?false:pan.length===10)} />
          <div style={S.hint}>Example: ABCDE1234F · Used to verify your identity with Income Tax dept</div>

          <div style={S.lbl}>Date of Birth</div>
          <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={{ ...S.inp(false), textTransform:'none', letterSpacing:'normal' }} />
          <div style={S.hint}>Must match your PAN card records</div>

          {err && <div style={S.err}>{err}</div>}

          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={() => setStep('select')} style={{ ...S.btn(false), background:'transparent', color:'rgba(245,240,232,0.4)', border:'1px solid rgba(245,240,232,0.12)', boxShadow:'none' }}>← Back</button>
            <button onClick={submitPan} disabled={!panValid || !dob || loading} style={{ ...S.btn(!panValid||!dob||loading), flex:1 }}>
              {loading ? 'Verifying PAN...' : 'Verify PAN →'}
            </button>
          </div>
        </div>
      )}

      {/* Step: Aadhaar */}
      {step === 'aadhaar' && (
        <div style={S.card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(255,107,0,0.15)', border:'2px solid #FF6B00', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Bebas Neue',sans-serif", fontSize:'16px', color:'#FF6B00' }}>2</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'24px', letterSpacing:'1px' }}>Aadhaar Verification</div>
          </div>

          <div style={{ background:'rgba(74,158,255,0.06)', border:'1px solid rgba(74,158,255,0.2)', borderRadius:'3px', padding:'12px 16px', marginBottom:'20px', fontSize:'13px', color:'rgba(245,240,232,0.5)', lineHeight:1.6 }}>
            🔒 Your Aadhaar is verified via <strong style={{color:'#F0EBE0'}}>UIDAI / Digio API</strong>. We only store that verification passed — not your full Aadhaar number.
          </div>

          <div style={S.lbl}>Aadhaar Number</div>
          <input value={aadhaar} onChange={e => setAadhaar(e.target.value.replace(/\D/g,'').slice(0,12))}
            placeholder="1234 5678 9012" style={{ ...S.inp(!aadhaar||aadhaarValid?false:aadhaar.length===12), letterSpacing:'3px' }} />
          <div style={S.hint}>12-digit Aadhaar number · An OTP will be sent to your registered mobile</div>

          {err && <div style={S.err}>{err}</div>}

          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={() => setStep('pan')} style={{ ...S.btn(false), background:'transparent', color:'rgba(245,240,232,0.4)', border:'1px solid rgba(245,240,232,0.12)', boxShadow:'none' }}>← Back</button>
            <button onClick={submitAadhaar} disabled={!aadhaarValid || loading} style={{ ...S.btn(!aadhaarValid||loading), flex:1 }}>
              {loading ? 'Sending OTP...' : 'Verify Aadhaar →'}
            </button>
          </div>
        </div>
      )}

      {/* Step: Selfie */}
      {step === 'selfie' && (
        <div style={S.card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(255,107,0,0.15)', border:'2px solid #FF6B00', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Bebas Neue',sans-serif", fontSize:'16px', color:'#FF6B00' }}>3</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'24px', letterSpacing:'1px' }}>Selfie Verification</div>
          </div>
          <div style={{ textAlign:'center', padding:'32px 0' }}>
            <div style={{ width:'120px', height:'120px', borderRadius:'50%', background:'rgba(245,240,232,0.04)', border:'2px dashed rgba(245,240,232,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'48px', margin:'0 auto 20px', cursor:'pointer' }}>📷</div>
            <div style={{ fontSize:'14px', color:'rgba(245,240,232,0.4)', marginBottom:'24px', lineHeight:1.6 }}>
              Take a quick selfie for face match verification.<br/>Used with Digio / HyperVerge liveness check.
            </div>
            <button onClick={submitSelfie} disabled={loading} style={{ ...S.btn(loading) }}>
              {loading ? '🔍 Verifying...' : '📸 Take Selfie & Verify'}
            </button>
          </div>
        </div>
      )}

      {/* Done */}
      {step === 'done' && (
        <div style={{ ...S.card, textAlign:'center', padding:'40px', borderColor:'rgba(15,183,96,0.25)' }}>
          <div style={{ fontSize:'56px', marginBottom:'16px' }}>🎉</div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'36px', color:'#0FB760', marginBottom:'8px' }}>
            {kyc === 'verified' ? 'Full KYC Done!' : 'Basic KYC Done!'}
          </div>
          <div style={{ fontSize:'14px', color:'rgba(245,240,232,0.45)', lineHeight:1.6, marginBottom:'24px' }}>
            {kyc === 'verified'
              ? 'Wallet limit: ₹1,00,000 · Instant UPI withdrawals enabled'
              : 'Wallet limit: ₹10,000 · Complete full KYC for higher limits'}
          </div>
          {kyc === 'basic' && (
            <button onClick={() => { setStep('pan'); setType('full'); }} style={{ ...S.btn(false), marginRight:'10px' }}>
              Upgrade to Full KYC →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
