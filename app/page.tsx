"use client";
import { useState } from "react";
export default function Home(){
  const [q,setQ]=useState(""); const [list,setList]=useState<any[]>([]); const [lang,setLang]=useState("ur"); const [load,setLoad]=useState(false);
  const GROQ_KEY = "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";
  async function search(){
    if(!q.trim()) return; const myQ=q; setQ(""); setList(s=>[...s,{r:"u",t:myQ}]); setLoad(true);
    try{
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions",{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${GROQ_KEY}`},
        body: JSON.stringify({
          model:"llama-3.1-8b-instant",
          messages:[
            {role:"system", content: lang==="ur"? "You are Nawaz Publication expert teacher for 9th-12th class. Explain any topic in detailed Roman Urdu + English mix. Structure: Definition, Types/Formula, Example, Important points for exam. If user says hi/hello/salam, greet nicely and ask for topic." : "You are expert teacher, explain topic in detail with examples."},
            {role:"user", content:myQ}
          ]
        })
      });
      const data = await res.json();
      if(data.error){ setList(s=>[...s,{r:"a",t:"GROQ Error: "+JSON.stringify(data.error)}]); }
      else { setList(s=>[...s,{r:"a",t:data.choices[0].message.content}]); }
    }catch(e:any){ setList(s=>[...s,{r:"a",t:"Error: "+e.message}]); }
    setLoad(false);
  }
  return(
    <div style={{minHeight:"100vh",background:"#0f0f0f",color:"white",display:"flex",flexDirection:"column",fontFamily:"system-ui"}}>
      <div style={{padding:14,textAlign:"center",borderBottom:"1px solid #222"}}><b style={{fontSize:20}}>NawazPublication - AI Notes</b><br/><span style={{color:"#888",fontSize:12}}>Real AI - Ab 100% Working</span>
        <div style={{marginTop:10,display:"flex",gap:8,justifyContent:"center"}}>
          <button onClick={()=>setLang("ur")} style={{padding:"6px 14px",borderRadius:20,background:lang==="ur"?"white":"#222",color:lang==="ur"?"black":"white"}}>اردو</button>
          <button onClick={()=>setLang("en")} style={{padding:"6px 14px",borderRadius:20,background:lang==="en"?"white":"#222",color:lang==="en"?"black":"white"}}>English</button>
        </div>
      </div>
      <div style={{flex:1,maxWidth:700,width:"100%",margin:"0 auto",padding:14,overflowY:"auto"}}>
        {list.map((m,i)=><div key={i} style={{background:m.r==="u"?"#2f2f2f":"#171717",border:"1px solid #333",padding:14,borderRadius:14,marginBottom:10,marginLeft:m.r==="u"?40:0,marginRight:m.r==="a"?20:0,whiteSpace:"pre-wrap",lineHeight:1.7,fontSize:14}}>{m.t}</div>)}
        {load && <div style={{color:"#888",padding:10}}>AI soch raha hai...</div>}
        {list.length===0 && <div style={{textAlign:"center",marginTop:80,color:"#555"}}>Koi bhi topic likhen<br/>Sequence, Photosynthesis, Matrix, Logarithm</div>}
      </div>
      <div style={{padding:12,position:"sticky",bottom:0,background:"#0f0f0f",borderTop:"1px solid #222"}}>
        <div style={{maxWidth:700,margin:"0 auto",display:"flex",background:"#1e1e1e",borderRadius:28,padding:"4px 10px",border:"1px solid #333"}}>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder="Topic likhen..." style={{flex:1,background:"transparent",border:"none",outline:"none",color:"white",padding:12}}/>
          <button onClick={search} style={{background:"white",color:"black",borderRadius:50,width:38,height:38,border:"none",fontWeight:"bold",cursor:"pointer"}}>↑</button>
        </div>
      </div>
    </div>
  )
}
