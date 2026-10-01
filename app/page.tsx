"use client";
import { useState, useEffect } from "react";
export default function Home(){
  const [q,setQ]=useState(""); const [list,setList]=useState<any[]>([]); const [lang,setLang]=useState("ur"); const [load,setLoad]=useState(false);
  const GROQ_KEY = "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";
  const SITE = "nawazpublication-rkh4.vercel.app";

  useEffect(()=>{
    const l1=document.createElement("link"); l1.rel="stylesheet"; l1.href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"; document.head.appendChild(l1);
    const s=document.createElement("script"); s.src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"; document.head.appendChild(s);
  },[]);

  function downloadPDF(text:string){
    const win = window.open("", "_blank");
    if(!win) return;
    win.document.write(`
      <html><head><title>Nawaz Notes</title>
      <style>
        body{font-family:system-ui; padding:40px; line-height:1.8; position:relative;}
       .wm{position:fixed; top:0; left:0; width:100%; height:100%; z-index:0; opacity:0.12; pointer-events:none; display:flex; flex-wrap:wrap; gap:100px; transform:rotate(-30deg);}
       .wm span{font-size:32px; font-weight:bold; color:#000;}
       .content{position:relative; z-index:1;}
        @media print {.no-print{display:none}}
      </style>
      </head><body>
      <div class="wm">
        ${Array(20).fill(`<span>${SITE}</span>`).join("")}
      </div>
      <div class="content">
        <h2>Nawaz Publication - ${SITE}</h2>
        <hr/>
        <pre style="white-space:pre-wrap; font-family:system-ui; font-size:14px;">${text.replace(/</g,"&lt;")}</pre>
        <br/><hr/><p style="font-size:12px; color:#666;">Downloaded from ${SITE} | Watermark protected</p>
        <button class="no-print" onclick="window.print()" style="padding:10px 20px; background:black; color:white; border-radius:8px;">Print / Save as PDF</button>
      </div>
      </body></html>
    `);
    win.document.close();
  }

  async function search(){
    if(!q.trim()) return; const myQ=q; setQ(""); setList(s=>[...s,{r:"u",t:myQ}]); setLoad(true);
    try{
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions",{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ_KEY},
        body: JSON.stringify({
          model:"openai/gpt-oss-20b",
          messages:[
            {role:"system", content: "You are Nawaz Publication expert. Write ALL math in LaTeX like $x^2$ and $$ \\begin{bmatrix}1&2\\\\3&4\\end{bmatrix} $$. Use Roman Urdu + English handwritten style. Structure: Definition, Formula, Steps, Example."},
            {role:"user", content:myQ}
          ]
        })
      });
      const data = await res.json();
      if(data.error){ setList(s=>[...s,{r:"a",t:"Error: "+data.error.message}]); }
      else { setList(s=>[...s,{r:"a",t:data.choices[0].message.content}]); }
    }catch(e:any){ setList(s=>[...s,{r:"a",t:"Error: "+e.message}]); }
    setLoad(false);
  }

  return(
    <div style={{minHeight:"100vh",background:"#0f0f0f",color:"white",display:"flex",flexDirection:"column"}}>
      <div style={{padding:14,textAlign:"center",borderBottom:"1px solid #222"}}><b style={{fontSize:20}}>NawazPublication</b><br/><span style={{color:"#888",fontSize:11}}>{SITE} | Handwritten Maths + PDF</span></div>
      <div style={{flex:1,maxWidth:750,width:"100%",margin:"0 auto",padding:14,overflowY:"auto"}}>
        {list.map((m,i)=><div key={i} style={{background:m.r==="u"?"#2f2f2f":"#171717",border:"1px solid #333",padding:16,borderRadius:14,marginBottom:12,marginLeft:m.r==="u"?40:0}}>
          <div style={{whiteSpace:"pre-wrap",lineHeight:1.8,fontSize:15}}>{m.t}</div>
          {m.r==="a" && <div style={{marginTop:12,display:"flex",gap:8}}>
            <button onClick={()=>downloadPDF(m.t)} style={{background:"#fff",color:"#000",border:"none",padding:"8px 14px",borderRadius:20,fontSize:12,fontWeight:"bold"}}>📄 PDF Download (Watermark)</button>
          </div>}
        </div>)}
        {load && <div style={{color:"#888",padding:10}}>AI likh raha hai...</div>}
      </div>
      <div style={{padding:12,position:"sticky",bottom:0,background:"#0f0f0f",borderTop:"1px solid #222"}}>
        <div style={{maxWidth:750,margin:"0 auto",display:"flex",background:"#1e1e1e",borderRadius:28,padding:"4px 10px",border:"1px solid #333"}}>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder="Matrix likhen..." style={{flex:1,background:"transparent",border:"none",outline:"none",color:"white",padding:12}}/>
          <button onClick={search} style={{background:"white",color:"black",borderRadius:50,width:38,height:38,border:"none",fontWeight:"bold"}}>↑</button>
        </div>
      </div>
    </div>
  )
}
