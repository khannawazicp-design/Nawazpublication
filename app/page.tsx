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

  async function downloadPDF(text:string, title:string){
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    doc.setTextColor(230,230,230); doc.setFontSize(28);
    for(let i=0;i<8;i++){ doc.text(SITE, 15, 30 + i*35, {angle:45}); }
    doc.setTextColor(0,0,0); doc.setFontSize(16); doc.text(title, 10, 12);
    doc.setFontSize(11);
    const clean = text.replace(/<[^>]*>/g,"");
    const lines = doc.splitTextToSize(clean, pageW-20);
    let y=22;
    lines.forEach((l:string)=>{
      if(y>pageH-10){ doc.addPage(); doc.setTextColor(230,230,230); doc.setFontSize(28); doc.text(SITE, 15, 40, {angle:45}); doc.setTextColor(0,0,0); doc.setFontSize(11); y=15; }
      doc.text(l,10,y); y+=6;
    });
    doc.save(title+".pdf");
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
            {role:"system", content: "You are Nawaz Publication expert teacher. Write ALL math formulas in LaTeX like $x^2 + 2x$ and $$ \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} $$. Explain in "+(lang==="ur"?"Roman Urdu + English, step by step handwritten style":"English")},
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
    <div style={{minHeight:"100vh",background:"#0f0f0f",color:"white",display:"flex",flexDirection:"column",fontFamily:"system-ui"}}>
      <div style={{padding:14,textAlign:"center",borderBottom:"1px solid #222"}}><b style={{fontSize:20}}>NawazPublication - AI Notes</b><br/><span style={{color:"#888",fontSize:11}}>{SITE} | Handwritten Maths</span>
        <div style={{marginTop:10,display:"flex",gap:8,justifyContent:"center"}}>
          <button onClick={()=>setLang("ur")} style={{padding:"6px 14px",borderRadius:20,background:lang==="ur"?"white":"#222",color:lang==="ur"?"black":"white"}}>اردو</button>
          <button onClick={()=>setLang("en")} style={{padding:"6px 14px",borderRadius:20,background:lang==="en"?"white":"#222",color:lang==="en"?"black":"white"}}>English</button>
        </div>
      </div>
      <div style={{flex:1,maxWidth:750,width:"100%",margin:"0 auto",padding:14,overflowY:"auto"}}>
        {list.map((m,i)=><div key={i} style={{background:m.r==="u"?"#2f2f2f":"#171717",border:"1px solid #333",padding:16,borderRadius:14,marginBottom:12,marginLeft:m.r==="u"?40:0}}>
          <div style={{whiteSpace:"pre-wrap",lineHeight:1.8,fontSize:15}}>{m.t}</div>
          {m.r==="a" && <div style={{marginTop:12,display:"flex",gap:8}}>
            <button onClick={()=>downloadPDF(m.t, "Nawaz_Notes")} style={{background:"#fff",color:"#000",border:"none",padding:"8px 14px",borderRadius:20,fontSize:12,fontWeight:"bold",cursor:"pointer"}}>📄 PDF Download</button>
            <button onClick={()=>navigator.clipboard.writeText(m.t)} style={{background:"#222",color:"#fff",border:"1px solid #444",padding:"8px 14px",borderRadius:20,fontSize:12}}>Copy</button>
          </div>}
        </div>)}
        {load && <div style={{color:"#888",padding:10}}>AI likh raha hai...</div>}
        {list.length===0 && <div style={{textAlign:"center",marginTop:80,color:"#555"}}>Matrix, Logarithm likh ke dekhen<br/>PDF me {SITE} watermark ayega</div>}
      </div>
      <div style={{padding:12,position:"sticky",bottom:0,background:"#0f0f0f",borderTop:"1px solid #222"}}>
        <div style={{maxWidth:750,margin:"0 auto",display:"flex",background:"#1e1e1e",borderRadius:28,padding:"4px 10px",border:"1px solid #333"}}>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder="Topic likhen..." style={{flex:1,background:"transparent",border:"none",outline:"none",color:"white",padding:12}}/>
          <button onClick={search} style={{background:"white",color:"black",borderRadius:50,width:38,height:38,border:"none",fontWeight:"bold"}}>↑</button>
        </div>
      </div>
    </div>
  )
}
