"use client";
import { useState, useEffect, useRef } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [chats, setChats] = useState<{role:string,text:string,image?:string}[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem("nawaz_email");
    const savedHistory = localStorage.getItem("nawaz_history");
    if(savedEmail){ setEmail(savedEmail); setShowLogin(false); }
    if(savedHistory){ setHistory(JSON.parse(savedHistory)); }
  }, []);

  // Ye function sara gand saaf kar dega ** ## ```
  const cleanText = (text: string) => {
    if(!text) return "";
    return text
      .replace(/\*\*/g, "")
      .replace(/##+/g, "")
      .replace(/```/g, "")
      .replace(/`/g, "")
      .replace(/^\s*[-*]\s+/gm, "")
      .trim();
  };

  const handleLogin = () => {
    if(!email.includes("@")) return alert("Sahi email likhen");
    localStorage.setItem("nawaz_email", email);
    setShowLogin(false);
  };

  const handleImage = (e:any) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const send = async () => {
    if (!input.trim() && !selectedImage) return;
    const userMsg = { role: "user", text: input, image: selectedImage || undefined };
    setChats(p => [...p, userMsg]);
    const title = input.slice(0, 25) || "Image Question";
    if(input.trim()){
      const newHist = [title, ...history].slice(0,20);
      setHistory(newHist);
      localStorage.setItem("nawaz_history", JSON.stringify(newHist));
    }
    const msgToSend = input; const imgToSend = selectedImage;
    setInput(""); setSelectedImage(null); setLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: msgToSend, image: imgToSend }) });
      const data = await res.json();
      setChats(p => [...p, { role: "ai", text: cleanText(data.reply) }]);
    } catch { setChats(p => [...p, { role: "ai", text: "Error, dobara koshish karen" }]); }
    setLoading(false);
  };

  if(showLogin){
    return (
      <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f5f5'}}>
        <div style={{background:'white', padding:30, borderRadius:15, width:350, textAlign:'center', boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
          <h2><b>Nawaz</b><span style={{color:'#f59e0b'}}>Academy</span></h2>
          <p style={{fontSize:13, color:'#666'}}>AI Ustad istemal karne ke liye login karen</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Apna email likhen" style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #ccc', marginTop:15}}/>
          <button onClick={handleLogin} style={{width:'100%', background:'black', color:'white', padding:12, borderRadius:8, marginTop:10}}>Continue</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial', background: '#f5f5f5' }}>
      <div style={{ width: 260, background: '#202123', color: 'white', padding: 12, display: 'flex', flexDirection: 'column' }}>
        <button onClick={() => setChats([])} style={{ background: '#343541', color: 'white', padding: 10, borderRadius: 6, border: '1px solid #555' }}>+ New Chat</button>
        <div style={{ marginTop: 15, fontSize: 12, color: '#aaa' }}>{email}</div>
        <div style={{ flex: 1, overflowY: 'auto', marginTop: 5 }}>{history.map((h, i) => <div key={i} onClick={()=>setInput(h)} style={{ padding: '8px 0', fontSize: 13, borderBottom: '1px solid #333', cursor:'pointer' }}>{cleanText(h)}</div>)}</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 15, background: 'white', borderBottom: '1px solid #ddd' }}><b>Nawaz<span style={{ color: '#f59e0b' }}>Academy</span> - AI Ustad</b></div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {chats.length === 0? <div style={{ textAlign: 'center', marginTop: 80 }}><h1 style={{ fontSize: 32, fontWeight: 800 }}>Har sawal ka jawab<br/><span style={{ color: '#f59e0b' }}>AI Ustad ke sath</span></h1><p>Koi bhi sawal, koi bhi tasveer poochen</p></div> : chats.map((c, i) => <div key={i} style={{ background: c.role === 'user'? 'black' : 'white', color: c.role === 'user'? 'white' : 'black', padding: 14, borderRadius: 10, marginBottom: 10, maxWidth: 700, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight:'1.6', marginLeft: c.role === 'user'? 'auto' : 0, boxShadow:'0 1px 3px rgba(0,0,0,0.1)' }}>{c.image && <img src={c.image} style={{width:'100%', borderRadius:8, marginBottom:8, maxHeight:200, objectFit:'contain'}}/>}{cleanText(c.text)}</div>)}
          {loading && <div>AI soch raha hai...</div>}
        </div>
        <div style={{ padding: 12, background: 'white', borderTop: '1px solid #ddd' }}>
          {selectedImage && <div style={{marginBottom:8, display:'flex', alignItems:'center', gap:8}}><img src={selectedImage} style={{height:60, borderRadius:8}}/><button onClick={()=>setSelectedImage(null)} style={{padding:'4px 8px'}}>X</button></div>}
          <div style={{ display: 'flex', gap: 8, maxWidth: 700, margin: '0 auto', width: '100%' }}>
            <input type="file" ref={fileRef} onChange={handleImage} accept="image/*" hidden/>
            <button onClick={()=>fileRef.current?.click()} style={{padding:'0 15px', borderRadius:20, border:'1px solid #ccc', background:'white'}}>📷</button>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="" style={{ flex: 1, padding: 12, borderRadius: 20, border: '1px solid #ccc' }} />
            <button onClick={send} style={{ background: 'black', color: 'white', padding: '0 20px', borderRadius: 20 }}>Search</button>
          </div>
        </div>
      </div>
    </div>
  );
}
