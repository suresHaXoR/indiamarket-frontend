import { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabase';
import { useStore } from '../useStore';

const s = {
  wrap:    { display:'flex', minHeight:'100vh' },
  left:    { flex:1, background:'linear-gradient(135deg,#0C0B09 0%,#141210 100%)', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'48px', position:'relative', overflow:'hidden' },
  right:   { width:'420px', flexShrink:0, background:'#111110', borderLeft:'1px solid rgba(245,240,232,0.07)', display:'flex', flexDirection:'column', justifyContent:'center', padding:'52px 44px', position:'relative' },
  topLine: { position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,#FF6B00,#F5C518,#0FB760)' },
  logo:    { fontFamily:"'Bebas Neue',sans-serif", fontSize:'28px', letterSpacing:'3px', background:'linear-gradient(90deg,#FF6B00,#F5C518)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:'56px' },
  h1:      { fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(56px,6vw,90px)', lineHeight:0.92, marginBottom:'24px' },
  sub:     { fontSize:'15px', color:'rgba(245,240,232,0.4)', lineHeight:1.65, maxWidth:'380px', marginBottom:'40px' },
  stats:   { display:'flex', gap:'36px' },
  statN:   { fontFamily:"'Bebas Neue',sans-serif", fontSize:'34px', background:'linear-gradient(135deg,#FF6B00,#F5C518)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' },
  statL:   { fontSize:'11px', fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:'rgba(245,240,232,0.35)', marginTop:'3px' },
  prog:    { display:'flex', gap:'6px', marginBottom:'32px' },
  dot:     (a,d) => ({ flex:1, height:'3px', borderRadius:'2px', background: d?'#0FB760':a?'#FF6B00':'rgba(245,240,232,0.12)', transition:'background 0.3s' }),
  lbl:     { fontSize:'11px', fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:'#FF6B00', marginBottom:'12px' },
  title:   { fontFamily:"'Bebas Neue',sans-serif", fontSize:'40px', letterSpacing:'1px', marginBottom:'8px' },
  desc:    { fontSize:'14px', color:'rgba(245,240,232,0.45)', lineHeight:1.6, marginBottom:'32px' },
  pWrap:   { display:'flex', gap:0, marginBottom:'12px' },
  pCode:   { background:'#1E1E1C', border:'1px solid rgba(245,240,232,0.14)', borderRight:'none', padding:'0 16px', display:'flex', alignItems:'center', gap:'8px', fontFamily:"'DM Mono',monospace", fontSize:'15px', color:'rgba(245,240,232,0.5)', borderRadius:'2px 0 0 2px', flexShrink:0 },
  pInp:    { flex:1, background:'rgba(245,240,232,0.04)', border:'1px solid rgba(245,240,232,0.14)', borderRadius:'0 2px 2px 0', color:'#F0EBE0', fontFamily:"'DM Mono',monospace", fontSize:'20px', letterSpacing:'2px', padding:'15px 16px', outline:'none' },
  hint:    { fontSize:'12px', color:'rgba(245,240,232,0.3)', marginBottom:'24px' },
  otpRow:  { display:'flex', gap:'10px', marginBottom:'18px' },
  otpBox:  (focused,filled,err,ok) => ({ flex:1, aspectRatio:'1', maxWidth:'58px', background:ok?'rgba(15,183,96,0.07)':err?'rgba(255,64,64,0.06)':filled?'rgba(255,107,0,0.05)':'rgba(245,240,232,0.04)', border:`2px solid ${ok?'#0FB760':err?'#FF4040':filled?'rgba(255,107,0,0.4)':'rgba(245,240,232,0.14)'}`, borderRadius:'3px', color:'#F0EBE0', fontFamily:"'Bebas Neue',sans-serif", fontSize:'28px', textAlign:'center', outline:'none', transition:'all 0.15s' }),
  timer:   { display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'13px', color:'rgba(245,240,232,0.4)', marginBottom:'24px' },
  btn:     (disabled) => ({ width:'100%', padding:'17px', background:disabled?'#1E1E1C':'linear-gradient(135deg,#FF6B00,#FF4500)', color:disabled?'rgba(245,240,232,0.3)':'#0C0B09', fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:'16px', letterSpacing:'2px', textTransform:'uppercase', border:'none', borderRadius:'3px', cursor:disabled?'not-allowed':'pointer', marginBottom:'16px', boxShadow:disabled?'none':'0 4px 24px rgba(255,107,0,0.3)', transition:'all 0.15s' }),
  nInp:    { width:'100%', background:'rgba(245,240,232,0.04)', border:'1px solid rgba(245,240,232,0.14)', color:'#F0EBE0', fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:'20px', padding:'15px 16px', outline:'none', borderRadius:'2px', marginBottom:'10px' },
  err:     { background:'rgba(255,68,68,0.08)', border:'1px solid rgba(255,68,68,0.2)', color:'#FF7777', fontSize:'13px', padding:'10px 14px', borderRadius:'2px', marginBottom:'14px' },
  devBox:  { background:'rgba(212,169,42,0.08)', border:'1px solid rgba(212,169,42,0.25)', padding:'10px 16px', borderRadius:'2px', marginBottom:'16px', display:'flex', alignItems:'center', gap:'12px' },
  sucWrap: { textAlign:'center', padding:'20px 0' },
  sucIcon: { width:'80px', height:'80px', borderRadius:'50%', background:'rgba(15,183,96,0.12)', border:'2px solid rgba(15,183,96,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'36px', margin:'0 auto 24px' },
  sucT:    { fontFamily:"'Bebas Neue',sans-serif", fontSize:'42px', color:'#0FB760', marginBottom:'8px' },
  sucS:    { fontSize:'14px', color:'rgba(245,240,232,0.45)', marginBottom:'32px', lineHeight:1.6 },
  tc:      { display:'flex', height:'3px' },
};

export default function Login() {
  const { login } = useStore();
  const [step,     setStep]     = useState(1);   // 1=phone 2=otp 3=name 4=success
  const [phone,    setPhone]    = useState('');
  const [devOtp,   setDevOtp]   = useState('');
  const [otpVals,  setOtpVals]  = useState(['','','','','','']);
  const [otpState, setOtpState] = useState('idle'); // idle|error|success
  const [name,     setName]     = useState('');
  const [errMsg,   setErrMsg]   = useState('');
  const [loading,  setLoading]  = useState(false);
  const [timer,    setTimer]    = useState(60);
  const [isNew,    setIsNew]    = useState(false);
  const boxRefs = useRef([]);

  useEffect(() => {
    if (step !== 2) return;
    let t = 60; setTimer(60);
    const id = setInterval(() => { t--; setTimer(t); if (t <= 0) clearInterval(id); }, 1000);
    return () => clearInterval(id);
  }, [step]);

  async function doSendOtp() {
    if (!/^[6-9]\d{9}$/.test(phone)) { setErrMsg('Enter a valid 10-digit Indian mobile number'); return; }
    setLoading(true); setErrMsg('');
    try {
      // Production: await sendOtp(phone);
      // Demo:
      await new Promise(r => setTimeout(r, 900));
      setDevOtp('123456');
      setStep(2);
    } catch(e) { setErrMsg(e.message); }
    finally { setLoading(false); }
  }

  function onOtpChange(idx, val) {
    val = val.replace(/\D/,'').slice(-1);
    const next = [...otpVals]; next[idx] = val;
    setOtpVals(next); setOtpState('idle');
    if (val && idx < 5) boxRefs.current[idx+1]?.focus();
  }

  function onOtpKey(idx, e) {
    if (e.key === 'Backspace' && !otpVals[idx] && idx > 0) {
      const next = [...otpVals]; next[idx-1] = '';
      setOtpVals(next); boxRefs.current[idx-1]?.focus();
    }
    if (e.key === 'Enter') doVerify();
  }

  function onOtpPaste(e) {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6).split('');
    const next = ['','','','','',''];
    digits.forEach((d,i) => { next[i] = d; });
    setOtpVals(next);
    if (digits.length === 6) boxRefs.current[5]?.focus();
  }

  async function doVerify() {
    const code = otpVals.join('');
    if (code.length !== 6) return;
    setLoading(true); setErrMsg('');
    try {
      // Production: const data = await verifyOtp(phone, code); setIsNew(!data.user.user_metadata?.name);
      await new Promise(r => setTimeout(r, 800));
      if (code !== '123456') { setOtpState('error'); throw new Error('Wrong OTP. Use 123456 in demo.'); }
      setOtpState('success');
      await new Promise(r => setTimeout(r, 350));
      const seen = localStorage.getItem('im_user');
      setIsNew(!seen);
      if (!seen) setStep(3); else doSuccess('Haxor');
    } catch(e) { setErrMsg(e.message); setOtpState('error'); }
    finally { setLoading(false); }
  }

  function doSuccess(uname) {
    localStorage.setItem('im_user', uname || name || 'User');
    setStep(4);
    setTimeout(() => login({ id:'user_1', phone, name: uname || name || 'User' }), 1600);
  }

  const otpDone = otpVals.every(v => v !== '');
  const tc = <div style={s.tc}><div style={{flex:1,background:'#FF6B00'}}/><div style={{flex:1,background:'rgba(245,240,232,0.7)'}}/><div style={{flex:1,background:'#138808'}}/></div>;

  return (
    <div style={s.wrap}>
      {/* LEFT */}
      <div style={s.left}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 70% 50% at 20% 80%,rgba(255,107,0,0.14),transparent 60%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 50% 60% at 80% 20%,rgba(19,136,8,0.1),transparent 60%)',pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:2}}>
          {tc}
          <div style={{...s.logo,marginTop:'28px'}}>India<span style={{WebkitTextFillColor:'#0FB760'}}>Market</span></div>
          <div style={s.h1}>
            <div style={{color:'#FF6B00',display:'block'}}>Predict</div>
            <div style={{color:'#F0EBE0',display:'block'}}>Every</div>
            <div style={{color:'#0FB760',display:'block'}}>Match.</div>
          </div>
          <p style={s.sub}>Trade YES/NO on IPL, elections & more. Put your knowledge to work — and win.</p>
          <div style={s.stats}>
            {[['₹2.4Cr','Volume'],['18K+','Predictors'],['340+','Markets']].map(([n,l]) => (
              <div key={l}><div style={s.statN}>{n}</div><div style={s.statL}>{l}</div></div>
            ))}
          </div>
        </div>
        <div style={{position:'relative',zIndex:2,display:'flex',flexDirection:'column',gap:'8px'}}>
          {[['🏏','Will CSK beat MI tonight?','62¢','yes'],['🗳️','DMK 150+ seats TN 2026?','71¢','yes'],['⚡','Rohit 50+ runs today?','41¢','no']].map(([ic,t,p,s]) => (
            <div key={t} style={{background:'rgba(245,240,232,0.04)',border:'1px solid rgba(245,240,232,0.07)',padding:'10px 16px',display:'flex',alignItems:'center',gap:'12px',borderRadius:'2px',width:'260px'}}>
              <span>{ic}</span>
              <span style={{flex:1,fontSize:'12px',color:'rgba(245,240,232,0.45)',lineHeight:1.3}}>{t}</span>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:'13px',fontWeight:500,color:s==='yes'?'#0FB760':'#FF6B00'}}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div style={s.right}>
        <div style={s.topLine}/>

        {/* Progress */}
        <div style={s.prog}>
          {[1,2,3].map(n => <div key={n} style={s.dot(step===n, step>n)}/>)}
        </div>

        {/* Step 1 — Phone */}
        {step === 1 && (
          <div>
            <div style={s.lbl}>Step 1 of 3</div>
            <div style={s.title}>Enter Mobile</div>
            <p style={s.desc}>We'll send a 6-digit OTP. No password needed.</p>
            <div style={s.pWrap}>
              <div style={s.pCode}><span>🇮🇳</span> +91</div>
              <input style={s.pInp} type="tel" placeholder="98765 43210" maxLength={10}
                value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                onKeyDown={e => e.key==='Enter' && doSendOtp()} autoFocus />
            </div>
            <div style={s.hint}>Your number is never shared.</div>
            {errMsg && <div style={s.err}>{errMsg}</div>}
            <button style={s.btn(!phone || phone.length < 10 || loading)} onClick={doSendOtp} disabled={phone.length < 10 || loading}>
              {loading ? 'Sending...' : 'Send OTP →'}
            </button>
            <div style={{fontSize:'12px',color:'rgba(245,240,232,0.3)',textAlign:'center',lineHeight:1.6}}>
              By continuing you agree to our <span style={{color:'#FF6B00',cursor:'pointer'}}>Terms</span> &amp; <span style={{color:'#FF6B00',cursor:'pointer'}}>Privacy Policy</span>
            </div>
          </div>
        )}

        {/* Step 2 — OTP */}
        {step === 2 && (
          <div>
            <div style={s.lbl}>Step 2 of 3</div>
            <div style={s.title}>Verify OTP</div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px'}}>
              <span style={{fontSize:'13px',color:'rgba(245,240,232,0.4)'}}>Sent to <strong style={{color:'#F0EBE0'}}>+91 {phone.slice(0,3)}****{phone.slice(-3)}</strong></span>
              <span style={{fontSize:'12px',color:'#FF6B00',cursor:'pointer',fontWeight:600,textDecoration:'underline'}} onClick={()=>setStep(1)}>Change</span>
            </div>
            {devOtp && (
              <div style={s.devBox}>
                <span style={{fontSize:'11px',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'#D4A92A'}}>Dev OTP</span>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:'22px',color:'#D4A92A',letterSpacing:'4px'}}>{devOtp}</span>
              </div>
            )}
            <div style={s.otpRow} onPaste={onOtpPaste}>
              {otpVals.map((v,i) => (
                <input key={i} ref={el=>boxRefs.current[i]=el}
                  style={s.otpBox(false,!!v,otpState==='error',otpState==='success')}
                  type="tel" maxLength={1} inputMode="numeric" value={v}
                  onChange={e=>onOtpChange(i,e.target.value)}
                  onKeyDown={e=>onOtpKey(i,e)} />
              ))}
            </div>
            <div style={s.timer}>
              {timer > 0
                ? <span>Resend in <strong style={{color:'#F0EBE0'}}>{timer}s</strong></span>
                : <span style={{color:'rgba(245,240,232,0.4)'}}>Didn't get it?</span>}
              {timer <= 0 && <button style={{background:'none',border:'none',color:'#FF6B00',fontWeight:600,fontSize:'13px'}} onClick={()=>setStep(1)}>Resend OTP</button>}
            </div>
            {errMsg && <div style={s.err}>{errMsg}</div>}
            <button style={s.btn(!otpDone || loading)} onClick={doVerify} disabled={!otpDone || loading}>
              {loading ? 'Verifying...' : 'Verify & Continue →'}
            </button>
          </div>
        )}

        {/* Step 3 — Name */}
        {step === 3 && (
          <div>
            <div style={s.lbl}>Step 3 of 3</div>
            <div style={s.title}>Your Name</div>
            <p style={s.desc}>Used on the leaderboard. Can change later.</p>
            <input style={s.nInp} type="text" placeholder="Name / username" maxLength={30}
              value={name} onChange={e=>setName(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&doSuccess()} autoFocus />
            <div style={s.hint}>Min 3 characters.</div>
            {errMsg && <div style={s.err}>{errMsg}</div>}
            <button style={s.btn(name.length < 3)} onClick={()=>doSuccess()} disabled={name.length < 3}>
              Enter IndiaMarket →
            </button>
          </div>
        )}

        {/* Success */}
        {step === 4 && (
          <div style={s.sucWrap}>
            <div style={s.sucIcon}>🎉</div>
            <div style={s.sucT}>You're In!</div>
            <p style={s.sucS}>{isNew ? `Welcome, ${name || 'Haxor'}! Ready to predict?` : 'Welcome back! Loading your markets...'}</p>
            <div style={{fontSize:'13px',color:'rgba(245,240,232,0.3)'}}>Opening markets...</div>
          </div>
        )}
      </div>
    </div>
  );
}
