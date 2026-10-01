"use client";
import { useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

const GROQ_KEY = "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";
const SITE = "nawazpublication-rkh4.vercel.app";

function RenderText({ text }: { text: string }) {
  const parts:any[]=[]; let last=0; const re=/\$\$([\s\S]+?)\$\$|\$([^\$]+?)\$/g; let m,k=0;
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
  function makePDF(txt:string){
    const w=window.open("","_blank"); if(!w) return;
    w.document.write(`<html><head><meta charset="utf-8"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"><style>body{padding:30px;font-family:Noto Nastaliq Urdu, sans-serif;line-height:2}.wm{position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;opacity:0.07;transform:rotate(-35deg);display:flex;flex-wrap:wrap;gap:80px;pointer-events:none;font-size:30px;font-weight:bold;color:#000} @media print{.no-print{display:none}}</style></head><body><div class="wm">${Array(50).fill(SITE).map(s=>`<span>${s}</span>`).join("")}</div><h2 style="text-align:center">Nawaz Publication</h2><p style="text-align:center;font-size:12px;color:#666">${SITE}</p><hr><div style="margin-top:20px">${txt.replace(/</g,"&lt;").replace(/\n/g,"<br>")}</div><hr><div class="no-print" style="text-align:center;margin-top:20px"><button onclick="window.print()" style="background:#111;color:#fff;padding:10px 20px;border-radius:8px;border:none">Print / Save as PDF</button></div></body></html>`);
    w.document.close();
  }
  async function ask(){
    if(!q.trim()) return; const myQ=q; setQ(""); setList(s=>[...s,{u:true,t:myQ}]); setLoad(true);
    try{
      const r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ_KEY},body:JSON.stringify({model:"openai/gpt-oss-20b",messages:[{role:"system",content:"You are Nawaz Publication Expert Teacher. RULE: Detect user language. If Urdu script then answer in Urdu script, if Roman Urdu then Roman Urdu, if English then English. Teach clearly. Use $ for inline math like $x^2$ and $$ for big formulas like $$\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$$. No code blocks."},{role:"user",content:myQ}]})});
      const d=await r.json(); setList(s=>[...s,{u:false,t:d.error? "Error: "+d.error.message : d.choices[0].message.content}]);
    }catch(e:any){ setList(s=>[...s,{u:false,t:e.message}]);} setLoad(false);
  }
  return(
    <div style={{minHeight:"100vh",background:"#f8f8f8",color:"#111",display:"flex",flexDirection:"column"}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:list.length===0?"center":"flex-start",paddingTop:list.length===0?0:32}}>
        {list.length===0 && <div style={{textAlign:"center"}}><h1 style={{fontSize:34,fontWeight:800,margin:0}}>Nawaz Publication</h1><p style={{color:"#666",fontSize:13,marginTop:6}}>{SITE}</p><p style={{color:"#888",fontSize:12,marginTop:20}}>Maths, Physics, Urdu me sawal puchen</p></div>}
        <div style={{width:"100%",maxWidth:700,padding:"0 14px",marginTop:20}}>
          {list.map((m,i)=><div key={i} style={{background:"#fff",border:"1px solid #e6e6e6",padding:16,borderRadius:16,marginBottom:12,direction:/[\u0600-\u06FF]/.test(m.t)?"rtl":"ltr"}}><div style={{lineHeight:2,fontSize:15}}><RenderText text={m.t}/></div>{!m.u && <button onClick={()=>makePDF(m.t)} style={{marginTop:12,background:"#111",color:"#fff",border:"none",padding:"8px 16px",borderRadius:20,fontSize:13}}>📄 PDF + Watermark</button>}</div>)}
          {load && <div style={{textAlign:"center",padding:20,color:"#888"}}>Likha ja raha hai...</div>}
        </div>
      </div>
      <div style={{padding:14,background:"#fff",borderTop:"1px solid #e5e5e5",position:"sticky",bottom:0}}><div style={{maxWidth:700,margin:"0 auto",display:"flex",background:"#f1f1f1",borderRadius:30,padding:"4px 4px 4px 14px"}}><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask()} placeholder="Yahan sawal likhen..." style={{flex:1,background:"transparent",border:"none",outline:"none",padding:12,fontSize:15}}/><button onClick={ask} style={{background:"#111",color:"#fff",width:44,height:44,borderRadius:50,border:"none",fontSize:18}}>↑</button></div></div>
    </div>
  )
}
