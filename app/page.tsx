"use client";
import { useState, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

const KEY = "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";
const SITE = "nawazpublication-rkh4.vercel.app";

function RenderText({ text }: { text: string }) {
  const parts = [];
  let lastIndex = 0;
  const regex = /\$\$([\s\S]+?)\$\$|\$([^\$]+?)\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)/g;
  let match;
  let key = 0;
  while ((match = regex.exec(text))!== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++} style={{whiteSpace:"pre-wrap"}}>{text.slice(lastIndex, match.index)}</span>);
    }
    const math = match[1] || match[2] || match[3] || match[4];
    const isBlock =!!(match[1] || match[3]);
    try {
      const html = katex.renderToString(math, { displayMode: isBlock, throwOnError: false });
      parts.push(<span key={key++} dangerouslySetInnerHTML={{ __html: html }} style={isBlock? {display:"block", margin:"12px 0", overflowX:"auto"} : {}} />);
    } catch {
      parts.push(<code key={key++}>{math}</code>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(<span key={key++} style={{whiteSpace:"pre-wrap"}}>{text.slice(lastIndex)}</span>);
  }
  return <>{parts}</>;
}

export default function Home(){
  const [q,setQ]=useState(""); const [list,setList]=useState<any[]>([]); const [load,setLoad]=useState(false);

  function pdf(text:string){
    const w = window.open("","_blank");
    if(!w) return;
    w.document.write(`<html><head><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"><style>body{padding:30px;font-family:sans-serif;line-height:1.7;position:relative}.wm{position:fixed;top:0;left:0;width:100%;height:100%;opacity:0.1;transform:rotate(-30deg);display:flex;flex-wrap:wrap;gap:80px;pointer-events:none}.wm span{font-size:30px;font-weight:bold}</style></head><body><div class="wm">${Array(30).fill(`<span>${SITE}</span>`).join("")}</div><h2>Nawaz Publication - ${SITE}</h2><hr><div style="white-space:pre-wrap">${text.replace(/</g,"&lt;")}</div><hr><p style="color:#666;font-size:12px">Watermark: ${SITE}</p><button onclick="window.print()">Print / Save as PDF</button></body></html>`);
    w.document.close();
  }

  async function ask(){
    if(!q.trim()) return; const myQ=q; setQ(""); setList(s=>[...s,{u:true,t:myQ}]); setLoad(true);
    try{
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions",{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+KEY},
        body: JSON.stringify({
          model:"openai/gpt-oss-20b",
          messages:[
            {role:"system", content:"You are Nawaz Publication teacher. ALWAYS use $...$ for inline math and $$...$$ for block matrix/equations. Use pmatrix. Explain in Roman Urdu + English step by step handwritten style."},
            {role:"user", content:myQ}
          ]
        })
      });
      const d = await r.json();
      setList(s=>[...s,{u:false,t:d.error? "Error: "+d.error.message : d.choices[0].message.content}]);
    }catch(e:any){ setList(s=>[...s,{u:false,t:"Error: "+e.message}]); }
    setLoad(false);
  }

  return(
    <div style={{minHeight:"100vh",background:"#0f0f0f",color:"#fff",display:"flex",flexDirection:"column"}}>
      <div style={{padding:16,textAlign:"center",borderBottom:"1px solid #222"}}><b>NawazPublication - {SITE}</b><br/><span style={{fontSize:11,color:"#888"}}>Handwritten Maths + PDF Watermark</span></div>
      <div style={{flex:1,maxWidth:700,margin:"0 auto",width:"100%",padding:14}}>
        {list.map((m,i)=><div key={i} style={{background:m.u?"#2a2a2a":"#171717",border:"1px solid #333",padding:14,borderRadius:12,marginBottom:10}}>
          <div><RenderText text={m.t} /></div>
          {!m.u && <button onClick={()=>pdf(m.t)} style={{marginTop:10,background:"#fff",color:"#000",border:"none",padding:"7px 12px",borderRadius:20,fontSize:12,fontWeight:"bold"}}>📄 PDF + Watermark</button>}
        </div>)}
        {load && <div style={{color:"#888"}}>AI likh raha hai...</div>}
      </div>
      <div style={{padding:12,borderTop:"1px solid #222",position:"sticky",bottom:0,background:"#0f0f0f"}}>
        <div style={{maxWidth:700,margin:"0 auto",display:"flex",background:"#1e1e1e",borderRadius:25,padding:"4px 10px"}}>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask()} placeholder="Matrix, Photosynthesis likhen..." style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",padding:10}}/>
          <button onClick={ask} style={{background:"#fff",color:"#000",width:36,height:36,borderRadius:50,border:"none"}}>↑</button>
        </div>
      </div>
    </div>
  )
}
