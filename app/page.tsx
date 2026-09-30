"use client";
import { useState } from "react";

const DATA: any = {
  set: {
    ur: `سیٹ - تفصیلی نوٹس\n1. تعریف: اشیاء کے مجموعے کو سیٹ کہتے ہیں۔ مثال {1,2,3}\n2. اقسام: خالی، واحد، متناہی، غیر متناہی\n3. فارمولہ: n(AUB)=n(A)+n(B)-n(A∩B)\n4. امتحانی سوال: 10 نمبر کا سوال آتا ہے۔`,
    en: `SET - Detailed Notes (9th Class)\n1. Definition: Collection of well-defined objects is called Set. Eg {1,2,3}\n2. Types: Empty Set {}, Singleton {5}, Finite, Infinite\n3. Formula: n(AUB)=n(A)+n(B)-n(A∩B)\n4. Example: If A={1,2} B={2,3} then AUB={1,2,3}\n5. Exam: 10 marks question every year.`,
    ps: `سیټ - تفصیلی نوټس\n1. تعریف: د شیانو مجموعې ته سیټ وایي. مثال {1,2,3}\n2. ډولونه: خالي سیټ، واحد، محدود، غیر محدود`
  },
  matrix: {
    ur: `میٹرکس - تفصیلی نوٹس\n1. تعریف: نمبروں کو قطاروں اور کالموں میں لکھنا میٹرکس ہے۔ [[1,2],[3,4]]\n2. اقسام: قطار، کالم، مربع، صفر میٹرکس\n3. اہمیت: 10th کلاس میں Inverse نکالنا 5 نمبر کا ہے۔`,
    en: `MATRIX - Detailed Notes\n1. Definition: Arrangement of numbers in rows and columns is Matrix. Eg [[1,2],[3,4]]\n2. Types: Row, Column, Square, Zero, Identity\n3. Order: m x n\n4. Exam: Finding Inverse is 5 marks in 10th class.`,
    ps: `میټرکس - تفصیلی نوټس\n1. تعریف: په قطارونو او کالمونو کې د شمیرو لیکل میټرکس دی۔`
  }
};

export default function Home(){
  const [q,setQ]=useState(""); const [list,setList]=useState<any[]>([]); const [lang,setLang]=useState("ur");

  function getAns(query:string){
    const key = query.toLowerCase();
    for(let k in DATA){ if(key.includes(k)) return DATA[k][lang]; }
    // Default answer in selected language
    if(lang==="ur") return `${query} کا تفصیلی نوٹس:\n1. تعارف: یہ ${query} اہم چیپٹر ہے۔\n2. تعریف: اس کی تعریف اور 3 اقسام یاد کریں۔\n3. مثال اور فارمولہ بورڈ میں آتا ہے۔\n4. Nawaz Notes میں اردو میں مکمل موجود ہے۔`;
    if(lang==="ps") return `${query} - تفصیلی نوټس په پښتو کې - دا یو مهم چیپټر دی۔`;
    return `${query} - Detailed Notes:\n1. Introduction: ${query} is important chapter for 9th-12th.\n2. Definition: Learn its definition and 3 types.\n3. Example and formula is asked in board exam.\n4. Full notes available in Nawaz Publication.`;
  }

  function search(){ if(!q) return; const qq=q; setQ(""); setList(p=>[...p, {r:"u", t:qq}, {r:"a", t:getAns(qq)}]); }

  return (
    <div style={{minHeight:"100vh", background:"#0f0f0f", color:"white", display:"flex", flexDirection:"column"}}>
      <div style={{padding:12, textAlign:"center", borderBottom:"1px solid #222"}}>
        <h1 style={{margin:0, fontSize:18}}>NawazPublication - AI Notes</h1>
        <div style={{marginTop:8, display:"flex", justifyContent:"center", gap:8}}>
          <button onClick={()=>setLang("ur")} style={{padding:"5px 12px", borderRadius:20, border:"1px solid #444", background: lang==="ur"?"white":"#222", color: lang==="ur"?"black":"white"}}>اردو</button>
          <button onClick={()=>setLang("en")} style={{padding:"5px 12px", borderRadius:20, border:"1px solid #444", background: lang==="en"?"white":"#222", color: lang==="en"?"black":"white"}}>English</button>
          <button onClick={()=>setLang("ps")} style={{padding:"5px 12px", borderRadius:20, border:"1px solid #444", background: lang==="ps"?"white":"#222", color: lang==="ps"?"black":"white"}}>پښتو</button>
        </div>
      </div>

      <div style={{flex:1, maxWidth:700, width:"100%", margin:"0 auto", padding:16}}>
        {list.map((m,i)=><div key={i} style={{background: m.r==="u"? "#2f2f2f" : "#171717", border:"1px solid #2a2a2a", padding:14, borderRadius:16, marginBottom:12, marginLeft: m.r==="u"? 50:0, whiteSpace:"pre-wrap", lineHeight:1.6}}>{m.t}</div>)}
        {list.length===0 && <div style={{textAlign:"center", marginTop:60, color:"#888"}}>Language select karke koi topic likhen - jaise Set, Matrix</div>}
      </div>

      <div style={{padding:14, position:"sticky", bottom:0, background:"#0f0f0f", borderTop:"1px solid #222"}}>
        <div style={{maxWidth:700, margin:"0 auto", display:"flex", background:"#1e1e1e", borderRadius:28, padding:"4px 10px", border:"1px solid #333"}}>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder={lang==="ur"?"
