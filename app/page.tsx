"use client";
import { useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import jsPDF from "jspdf";

const KEY = "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";
const SITE = "nawazpublication-rkh4.vercel.app";

function RenderText({ text }: { text: string }) {
  const parts:any[] = []; let lastIndex=0; const regex=/\$\$([\s\S]+?)\$\$|\$([^\$]+?)\$/g;
  let m; let k=0;
  while((m=regex.exec(text))!==null){
    if(m.index>lastIndex) parts.push(<span key={k++} style={{whiteSpace:"pre-wrap"}}>{text.slice(lastIndex,m.index)}</span>);
    try{
      const html=katex.renderToString(m[1]||m[2],{displayMode:!!m[1],throwOnError:false});
      parts.push(<span key={k++} dangerouslySetInnerHTML={{__html:html}} style={m[1]?{display:"block",margin:"12px 0"}:{}}/>);
    }catch{ parts.push(<span key={k++}>{m[1]||m[2]}</span>); }
    lastIndex=regex.lastIndex;
  }
  if(lastIndex<text.length) parts.push(<span key={k++} style={{whiteSpace:"pre-wrap"}}>{text.slice(lastIndex)}</span>);
  return <>{parts}</>;
}

export default function Home(){
  const [q,setQ]=useState(""); const [list,setList]=useState<any[]>([]); const [load,setLoad]=useState(false);

  function downloadPDF(text:string){
    const doc=new jsPDF(); const W=doc.internal.pageSize.getWidth(), H=doc.internal.pageSize.getHeight();
    doc.setFontSize(38); doc.setTextColor(235,235,235);
    for(let y=20;y<H;y+=40) for(let x=-20;x<W;x+=55) doc.text(SITE,x,y,{angle:-30});
    doc.setTextColor(0,0,0); doc.setFontSize(11);
    const lines=doc.splitTextToSize(text.replace(/\$/g,""), W-20);
    let y=20; doc.setFontSize(9); doc.text(SITE,10,y); y+=10;
    for(let l of lines){ if(y>H-15){doc.addPage(); y=15;} doc.text(l,10,y); y+=6; }
    doc.save(`${SITE}.pdf`);
  }

  async function ask(){
    if(!q.trim()) return;
    const myQ=q; setQ(""); setList(s=>[...s,{u:true,t:myQ}]); setLoad(true);

    // Language detect
    const isUrdu = /[\u0600-\u06FF]/.test(myQ);

    try{
      const r=await fetch("https://api.groq.com/openai/v1/chat/completions",{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+KEY},
        body: JSON.stringify({
          model:"openai/gpt-oss-20b",
          messages:[
            {role:"system", content: `
            You are Nawaz Publication Teacher.
            CRITICAL LANGUAGE RULE:
            - Detect user's language from their query.
            - If query is in proper Urdu script (اردو), answer ONLY in proper Urdu script (اردو), never Roman Urdu.
            - If query is in Roman Urdu (kya, kaise, hai), answer in Roman Urdu.
            - If query is in English, answer in English.
            - Reply in the SAME language/script as user used.

            STYLE RULE:
            - Teacher style, step-by-step, paragraph by paragraph.
            - No code blocks \`\`\` ever.
            - For Math use $x^2$ and $$ \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} $$
            - Clean, readable notes.
            `},
            {role:"user", content: myQ + (isUrdu? " (جواب خالص اردو رسم الخط میں دیں)" : "")}
          ]
        })
      });
      const d=await r.json();
      setList(s=>[...s,{u:false,t:d.error? "Error: "+d.error.message : d.choices[0].message.content}]);
    }catch(e:any){ setList(s=>[...s,{u:false,t:"Error: "+e.message}]); }
    setLoad(false);
  }

  return(
    <div style={{minHeight:"100vh",background:"#f8f8f8",color:"#111",display:"flex",flexDirection:"column"}}>
      {/* CLEAN DASHBOARD - ONLY SEARCH */}
      <div style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent: list.length===0? "center" : "flex-start", paddingTop: list.length===0?0:30}}>
        {list.length===0 && (
          <div style={{textAlign:"center", marginBottom:30}}>
            <h1 style={{fontSize:32, fontWeight:800, margin:0}}>Nawaz Publication</h1>
            <p style={{color:"#666", fontSize:14, marginTop:6}}>{SITE}</p>
          </div>
        )}

        <div style={{width:"100%", maxWidth:680, padding:"0 16px"}}>
          {list.map((m,i)=><div key={i} style={{background:m.u?"#fff":"#fff", border:"1px solid #e5e5e5", padding:16, borderRadius:14, marginBottom:12, boxShadow:"0 1px 2px rgba(0,0,0,0.05)", direction: /[\u0600-\u06FF]/.test(m.t)? "rtl" : "ltr"}}>
            <div style={{lineHeight:"1.9", fontSize:15}}><RenderText text={m.t} /></div>
            {!m.u && <button onClick={()=>downloadPDF(m.t)} style={{marginTop:12, background:"#111", color:"#fff", border:"none", padding:"8px 14px", borderRadius:20, fontSize:13, cursor:"pointer"}}>📥 PDF Download</button>}
          </div>)}
          {load && <div style={{textAlign:"center", color:"#888", padding:20}}>لکھا جا رہا ہے...</div>}
        </div>
      </div>

      {/* ONLY SEARCH BAR AT BOTTOM */}
      <div style={{padding:16, background:"#fff", borderTop:"1px solid #e5e5e5", position:"sticky", bottom:0}}>
        <div style={{maxWidth:680, margin:"0 auto", display:"flex", background:"#f1f1f1", borderRadius:30, padding:"5px 6px 5px 16px", alignItems:"center"}}>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask()} placeholder="یہاں سوال لکھیں / Yahan sawal likhen / Type your question..." style={{flex:1, background:"transparent", border:"none", outline:"none", padding:10, fontSize:15}}/>
          <button onClick={ask} style={{background:"#111", color:"#fff", width:42, height:42, borderRadius:50, border:"none", cursor:"pointer", fontSize:18}}>↑</button>
        </div>
      </div>
    </div>
  )
}
