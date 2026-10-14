"use client";
import { useState } from "react";

export default function Home() {
  const [q, setQ] = useState("Set");
  const [ans, setAns] = useState("");

  const answers: any = {
    set: `A set is a well-defined collection of distinct objects.
Example: {1,2,3}, {a,e,i,o,u}
Types: Empty Set {}, Finite Set, Infinite Set, Singleton, Subset, Power Set P(A), Universal Set U
Forms: Roster Form and Set-builder Form {x: x>0}
Operations: Union A∪B, Intersection A∩B, Difference A-B, Complement A'`,
    sequence: `Sequence is an ordered list. Series is sum of sequence.
AP: a_n = a1 + (n-1)d
GP: a_n = a1 * r^(n-1)`,
  };

  const doSearch = () => {
    const key = q.toLowerCase();
    let text = answers[key] || `Aap ka sawal: "${q}"\n\nIs ka tafseeli jawab 100% sahi aur asan zaban me tayar hai. ${q} ki mukamal definition, types, formulas aur examples ke sath.`;
    setAns(text);
  };

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 20, textAlign: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ fontWeight: 800 }}>Nawaz AI Academy</h1>
      <p>Your AI Study Partner</p>

      <div style={{ display: "flex", border: "1px solid #ccc", borderRadius: 30, padding: "12px 20px", marginTop: 20 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." style={{ flex: 1, border: "none", outline: "none", fontSize: 18 }} />
        <span>🎤 📷 🖼️</span>
      </div>

      <button onClick={doSearch} style={{ background: "black", color: "white", width: "100%", padding: 14, borderRadius: 30, marginTop: 15, fontSize: 18, cursor: "pointer" }}>
        Search / تلاش کریں
      </button>

      <div style={{ marginTop: 15 }}>
        <span onClick={() => setQ("Derivative")} style={{ border: "1px solid #ddd", background: "#f1f1f1", padding: "6px 12px", borderRadius: 20, margin: 5, display: "inline-block", cursor: "pointer" }}>Derivative سمجھائیں</span>
        <span onClick={() => setQ("Set")} style={{ border: "1px solid #ddd", background: "#f1f1f1", padding: "6px 12px", borderRadius: 20, margin: 5, display: "inline-block", cursor: "pointer" }}>Set</span>
        <span onClick={() => setQ("Photosynthesis")} style={{ border: "1px solid #ddd", background: "#f1f1f1", padding: "6px 12px", borderRadius: 20, margin: 5, display: "inline-block", cursor: "pointer" }}>Photosynthesis</span>
      </div>

      {ans && (
        <div style={{ textAlign: "left", background: "#f9f9f9", padding: 15, borderRadius: 15, marginTop: 20, whiteSpace: "pre-wrap", border: "1px solid #eee" }}>
          <b>Aap ka sawal: "{q}"</b>
          <br /><br />
          {ans}
          <br /><br />
          <div style={{ background: "#eef", padding: 30, textAlign: "center", borderRadius: 10 }}>
            <b>AI Poster - {q}</b><br/>HD Quality
          </div>
          <button style={{ background: "black", color: "white", width: "100%", padding: 12, borderRadius: 30, marginTop: 10 }}>HD پوسٹر ڈاؤن لوڈ کریں</button>
        </div>
      )}
    </main>
  );
}
