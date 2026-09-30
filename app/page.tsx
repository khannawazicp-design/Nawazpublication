"use client";
import { useState } from "react";

const DATA: any = {
  "set": "SET (سیٹ) - 9th Class Math:\n\n1. Definition: Objects ki collection ko Set kehte hain. Maslan {1,2,3}\n2. Types: Empty Set, Singleton, Finite, Infinite\n3. Example: A = {a,e,i,o,u} Vowels ka set hai\n4. Exam me: Set ke operations (Union, Intersection) se 10 marks ka sawal aata hai.",
  "matrix": "MATRIX (میٹرکس) - 9th/10th Math:\n\n1. Definition: Numbers ko rows aur columns me likhna Matrix kehlata hai.\n2. Types: Row Matrix, Column Matrix, Square Matrix\n3. Formula: Order = m x n (rows x columns)\n4. Example: [[1,2],[3,4]] ye 2x2 matrix hai\n5. Use: Physics aur Computer me bohat use hota hai.",
  "chemistry": "CHEMISTRY (کیمسٹری) - 10th Class:\n\nChapter: Electrochemistry\n1. Oxidation: Electron ka nikalna\n2. Reduction: Electron ka hasil karna\n3. Example: Zn -> Zn+2 + 2e- (Oxidation)\n4. Tip: Is chapter se MCQs lazmi aate hain.",
};

function getAnswer(q: string){
  const key = q.toLowerCase();
  for(let k in DATA){ if(key.includes(k)) return DATA[k]; }
  return `${q} ka Topic:\n\nYe ${q} 9th-12th ka important topic hai.\n\n• Definition: ${q} ka matlab hai iski bunyadi samajh\n• Main Points: Isme 3-4 important formulas/points hote hain jo exam me aate hain\n• Example: Hamare Nawaz Publication Notes me iski misaal Urdu, English, Pashto me di gayi hai\n\nAap "${q}" ke full notes PDF ke liye WhatsApp karen.`;
}

export default function Home() {
  const [q, setQ] = useState(""); const [list, setList] = useState<any[]>([]);
  function search(){
    if(!q) return; const qq=q; setQ("");
    setList(p=>[...p, {r:"u", t:qq}, {r:"a", t:getAnswer(qq)}]);
  }
  return (
    <div style={{minHeight:"100vh", background:"#111", color:"white", display:"flex", flexDirection:"column", fontFamily:"sans-serif"}}>
      <div style={{padding:16, textAlign:"center", borderBottom:"1px solid #333"}}>
        <h1 style={{margin:0, fontSize:22}}>NawazPublication - AI Notes</h1>
        <p style={{margin:0, fontSize:12, color:"#aaa"}}>AI-Powered | Urdu | English | Pashto</p>
      </div>
      <div style={{flex:1, maxWidth:700, width:"100%", margin:"0 auto", padding:16}}>
        {list.length===0 && <div style={{textAlign:"center", marginTop:60}}><h2>ChatGPT jaisa Search</h2><p style={{color:"#888"}}>Koi bhi topic likhen, AI explain karega</p><div style={{display:"flex", gap:8, justifyContent:"center", marginTop:12}}><button onClick={()=>setQ("Set")} style={{padding:"8px 12px", borderRadius:8, border:"1px solid #333", background:"#222", color:"white"}}>Set</button><button onClick={()=>setQ("Matrix")} style={{padding:"8px 12px", borderRadius:8, border:"1px solid #333", background:"#222", color:"white"}}>Matrix</button><button onClick={()=>setQ("10th Chemistry")} style={{padding:"8px 12px", borderRadius:8, border:"1px solid #333", background:"#222", color:"white"}}>Chemistry</button></div></div>}
        {list.map((m,i)=><div key={i} style={{background: m.r==="u"? "#2a2a2a" : "#1e1e1e", border:"1px solid #333", padding:12, borderRadius:12, marginBottom:10, marginLeft: m.r==="u"? 40 : 0, whiteSpace:"pre-wrap"}}>{m.t}</div>)}
      </div>
      <div style={{padding:16, position:"sticky", bottom:0, background:"#111", borderTop:"1px solid #333"}}>
        <div style={{maxWidth:700, margin:"0 auto", display:"flex", background:"#222", borderRadius:25, padding:"4px 12px", border:"1px solid #444"}}>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder="Matrix, Set, Chemistry..." style={{flex:1, background:"transparent", border:"none", outline:"none", color:"white", padding:10}}/>
          <button onClick={search} style={{background:"white", color:"black", border:"none", borderRadius:50, width:36, height:36, fontWeight:"bold"}}>↑</button>
        </div>
      </div>
    </div>
  )
}
