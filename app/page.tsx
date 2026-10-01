"use client";
import { useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

const KEY = "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";
const SITE = "nawazpublication-rkh4.vercel.app";

function RenderText({ text }: { text: string }) {
  const parts:any[] = []; let last=0; const re=/\$\$([\s\S]+?)\$\$|\$([^\$]+?)\$/g; let m,k=0;
  while((m=re.exec(text))!==null){
    if(m.index>last) parts.push(<span key={k++} style={{whiteSpace:"pre-wrap"}}>{text.slice(last,m.index)}</span>);
    try{ const html=katex.renderToString(m[1]||m[2],{displayMode:!!m[1],throwOnError:false}); parts.push(<span key={k++} dangerouslySetInnerHTML={{__html:html}} style={m[1]?{display:"block",margin:"12px 0"}:{}}/>);}catch{parts.push(<span key={k++}>{m[1]||m[2]}</span>);}
    last=re.lastIndex;
  }
  if(last<text.length) parts.push(<span key={k++} style={{whiteSpace:"pre-wrap"}}>{text.slice(last)}</span>);
  return <>{parts}</>;
}

export default function Home(){
  const [q,setQ]=useState(""); const [list,setList]=useState<any[]>([]); const [load,setLoad]=useState(false);
  function pdf(text:string){
    const w=window.open("","_blank"); if(!w) return;
    w.document.write(`<html><head><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"><style>body{padding:24px;font-family:sans-serif;line-height:1.8}.wm{position:fixed;top:0;left:0;width:100%;height:100%;opacity:0.08;transform:rotate(-30deg);display:flex;flex-wrap:wrap;gap:60px;pointer-events:none;font-size:28px;font-weight:bold}</style></head><body><div class="wm">${Array(40).fill(SITE).map(s=>`<span>${s}</span>`).join("")}</div><h2>Nawaz Publication - ${SITE}</h2><hr><div>${text.replace(/</g,"&lt;")}</div><hr><button onclick="window.print()">Print / Save as PDF</button></body></html>`);
    w.document.close();
  }
  async function ask(){
    if(!q.trim()) return; const myQ=q; setQ(""); setList(s=>[...s,{u:true,t:myQ}]); setLoad(true);
    const isUrdu=/[\u0600-\u06FF]/.test(myQ);
    try{
      const r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+KEY},body:JSON.stringify({model:"openai/gpt-oss-20b",messages:[{role:"system",content:`You are Nawaz Publication Teacher. LANGUAGE RULE: If user Urdu script then answer in Urdu script, if Roman Urdu then Roman Urdu, if English then English. Teacher style, no code blocks. Use $x^2$ and $$ \\begin{pmatrix}a&b\\\\c&d\\end{pmatrix} $$`},{role:"user",content:myQ+(isUrdu?" (اردو رسم الخط میں جواب دیں)":"")}]})});
      const d=await r.json(); setList(s=>[...s,{u:false,t:d.error? "Error: "+d.error.message : d.choices[0].message.content}]);
    }catch(e:any){ setList(s=>[...s,{u:false,t:"Error: "+e.message}]);} setLoad(false);
  }
  return(
    <div style={{minHeight:"100vh",background:"#f8f8f8",color:"#111",display:"flex",flexDirection:"column"}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:list.length===0?"center":"flex-start",paddingTop:list.length===0?0:30}}>
        {list.length===0 && <div style={{textAlign:"center",marginBottom:28}}><h1 style={{fontSize:32,fontWeight:800,margin:0}}>Nawaz Publication</h1><p style={{color:"#666",fontSize:13}}>{SITE}</p></div>}
        <div style={{width:"100%",maxWidth:680,padding:"0 16px"}}>
          {list.map((m,i)=><div key={i} style={{background:"#fff",border:"1px solid #e5e5e5",padding:16,borderRadius:14,marginBottom:12,direction:/[\u0600-\u06FF]/.test(m.t)?"rtl":"ltr"}}><div style={{lineHeight:1.9}}><RenderText text={m.t}/></div>{!m.u && <button onClick={()=>pdf(m.t)} style={{marginTop:10,background:"#111",color:"#fff",border:"none",padding:"8px 14px",borderRadius:20,fontSize:13}}>📄 PDF + Watermark</button>}</div>)}
          {load && <div style={{textAlign:"center",color:"#888",padding:20}}>لکھا جا رہا ہے...</div>}
        </div>
      </div>
      <div style={{padding:16,background:"#fff",borderTop:"1px solid #e5e5e5",position:"sticky",bottom:0}}><div style={{maxWidth:680,margin:"0 auto",display:"flex",background:"#f1f1f1",borderRadius:30,padding:"5px 6px 5px 16px"}}><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask()} placeholder="یہاں سوال لکھیں / Yahan likhen..." style={{flex:1,background:"transparent",border:"none",outline:"none",padding:10}}/><button onClick={ask} style={{background:"#111",color:"#fff",width:42,height:42,borderRadius:50,border:"none"}}>↑</button></div></div>
    </div>
  )
}
