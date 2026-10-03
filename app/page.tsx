"use client"

import { useState, useEffect, useRef } from "react"

type Msg = {
  q: string
  a: string
  img?: string
  diagram?: string
}

type Chat = {
  id: string
  title: string
  msgs: Msg[]
}

function ColorfulAnswer({ text }: { text: string }) {
  const lines = text.split("\n")

  return (
    <div style={{ lineHeight: "1.9", fontSize: "14.5px" }}>
      {lines.map((line, i) => {
        const l = line.trim()

        if (!l) {
          return <div key={i} style={{ height: "8px" }} />
        }

        if (l.toLowerCase().startsWith("definition:")) {
          return (
            <div
              key={i}
              style={{
                color: "#0f172a",
                fontWeight: 800,
                fontSize: "16px",
                background: "#f1f5f9",
                padding: "6px 10px",
                borderRadius: "8px",
                borderLeft: "4px solid #0ea5e9",
              }}
            >
              {l}
            </div>
          )
        }

        if (
          l.toLowerCase().startsWith("key points:") ||
          l.toLowerCase().startsWith("aham nukte:")
        ) {
          return (
            <div
              key={i}
              style={{
                color: "#dc2626",
                fontWeight: 800,
                marginTop: "10px",
                fontSize: "15px",
              }}
            >
              🔴 {l}
            </div>
          )
        }

        if (l.match(/^\d+\./)) {
          return (
            <div
              key={i}
              style={{
                color: "#1e293b",
                paddingLeft: "10px",
                borderLeft: "2px solid #e2e8f0",
                margin: "4px 0",
              }}
            >
              • {l.replace(/^\d+\.\s*/, "")}
            </div>
          )
        }

        if (
          l.toLowerCase().startsWith("example:") ||
          l.toLowerCase().startsWith("misal:")
        ) {
          return (
            <div
              key={i}
              style={{
                color: "#15803d",
                fontWeight: 700,
                background: "#f0fdf4",
                padding: "6px 10px",
                borderRadius: "8px",
                borderLeft: "4px solid #22c55e",
                marginTop: "10px",
              }}
            >
              🟢 {l}
            </div>
          )
        }

        if (l.includes("NAWAZ AI ACADEMY")) {
          return (
            <div
              key={i}
              style={{
                color: "#7c3aed",
                fontWeight: 800,
                fontSize: "12px",
                marginTop: "12px",
                textAlign: "right",
              }}
            >
              {l}
            </div>
          )
        }

        return (
          <div key={i} style={{ color: "#334155" }}>
            {l}
          </div>
        )
      })}
    </div>
  )
}


/* =========================================================
   LEVEL OPTIONS
========================================================= */

const LEVELS = [
  {
    id: "class2",
    name: "Class 2",
    instruction:
      "Answer for a Class 2 student. Use very simple words, short sentences, easy examples, and basic concepts. Avoid difficult terminology.",
  },
  {
    id: "class5",
    name: "Class 5",
    instruction:
      "Answer for a Class 5 student. Use simple but educational language, clear examples, basic explanation, and age-appropriate detail.",
  },
  {
    id: "class8",
    name: "Class 8",
    instruction:
      "Answer for a Class 8 student. Explain the concept clearly with moderate detail, examples, important points, and simple reasoning.",
  },
  {
    id: "class10",
    name: "Class 9–10",
    instruction:
      "Answer at Class 9–10 school/board level. Include proper definitions, concepts, important points, examples, formulas where relevant, and exam-oriented explanation.",
  },
  {
    id: "college",
    name: "College / Class 11–12",
    instruction:
      "Answer at college/Class 11–12 level. Give detailed academic explanation, formulas, derivations, examples, applications, and exam-oriented details where relevant.",
  },
  {
    id: "university",
    name: "University",
    instruction:
      "Answer at university level. Use appropriate academic terminology and provide detailed conceptual explanation, mathematical/formal reasoning, applications, examples, and advanced details where relevant.",
  },
]


/* =========================================================
   CREATE A LOCAL SVG DIAGRAM
   No external image URL = no broken image
========================================================= */

function createDiagram(topic: string, level: string) {
  const lower = topic.toLowerCase()

  let title = topic
  let boxes: string[] = []

  if (lower.includes("photosynthesis")) {
    title = "Photosynthesis"

    boxes = [
      "☀ Sunlight",
      "💧 Water (H₂O)",
      "🌿 Leaf / Chlorophyll",
      "CO₂",
      "🍬 Glucose",
      "O₂",
    ]
  } else if (lower.includes("heart")) {
    title = "Human Heart"

    boxes = [
      "Body",
      "Right Atrium",
      "Right Ventricle",
      "Lungs",
      "Left Atrium",
      "Left Ventricle",
      "Body",
    ]
  } else if (
    lower.includes("derivative") ||
    lower.includes("calculus") ||
    lower.includes("graph")
  ) {
    title = "Mathematical Concept"

    boxes = [
      "Function",
      "Change",
      "Derivative",
      "Slope",
      "Graph",
      "Application",
    ]
  } else if (
    lower.includes("chemical") ||
    lower.includes("reaction") ||
    lower.includes("chemistry")
  ) {
    title = "Chemical Reaction"

    boxes = [
      "Reactants",
      "Chemical Change",
      "Reaction",
      "Products",
      "Energy",
    ]
  } else {
    title = topic
    boxes = [
      "Basic Idea",
      "Main Concept",
      "Important Points",
      "Example",
      "Application",
      "Conclusion",
    ]
  }

  const safeTitle = title
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .slice(0, 55)

  const boxWidth = 230
  const boxHeight = 48
  const startX = 285

  const svgBoxes = boxes
    .map((b, i) => {
      const y = 90 + i * 62

      const safe = b
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")

      return `
        <rect
          x="${startX}"
          y="${y}"
          width="${boxWidth}"
          height="${boxHeight}"
          rx="12"
          fill="${i === 0 ? "#dbeafe" : "#f8fafc"}"
          stroke="#94a3b8"
          stroke-width="2"
        />

        <text
          x="${startX + boxWidth / 2}"
          y="${y + 30}"
          text-anchor="middle"
          font-size="16"
          font-family="Arial, sans-serif"
          font-weight="600"
          fill="#0f172a"
        >
          ${safe}
        </text>

        ${
          i < boxes.length - 1
            ? `
              <line
                x1="${startX + boxWidth / 2}"
                y1="${y + boxHeight}"
                x2="${startX + boxWidth / 2}"
                y2="${y + boxHeight + 14}"
                stroke="#64748b"
                stroke-width="2"
              />
              <polygon
                points="
                  ${startX + boxWidth / 2 - 5},${y + boxHeight + 10}
                  ${startX + boxWidth / 2 + 5},${y + boxHeight + 10}
                  ${startX + boxWidth / 2},${y + boxHeight + 17}
                "
                fill="#64748b"
              />
            `
            : ""
        }
      `
    })
    .join("")

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="560"
      viewBox="0 0 800 560"
    >
      <rect width="800" height="560" fill="#ffffff"/>

      <text
        x="400"
        y="42"
        text-anchor="middle"
        font-size="25"
        font-family="Arial, sans-serif"
        font-weight="800"
        fill="#0f172a"
      >
        ${safeTitle}
      </text>

      <text
        x="400"
        y="67"
        text-anchor="middle"
        font-size="13"
        font-family="Arial, sans-serif"
        fill="#64748b"
      >
        Educational Diagram • ${level}
      </text>

      ${svgBoxes}

      <text
        x="400"
        y="535"
        text-anchor="middle"
        font-size="12"
        font-family="Arial, sans-serif"
        font-weight="700"
        fill="#7c3aed"
      >
        NAWAZ AI ACADEMY
      </text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}


/* =========================================================
   MAIN HOME
========================================================= */

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeId, setActiveId] = useState("")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)

  // NEW: selected education level
  const [level, setLevel] = useState("class10")

  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const s = localStorage.getItem("nawaz_v4_pro")

    if (s) {
      const p = JSON.parse(s)
      setChats(p)
      setActiveId(p[0]?.id || "")
    } else {
      const id = Date.now().toString()

      setChats([
        {
          id,
          title: "New Chat",
          msgs: [],
        },
      ])

      setActiveId(id)
    }
  }, [])

  useEffect(() => {
    if (chats.length) {
      localStorage.setItem("nawaz_v4_pro", JSON.stringify(chats))
    }
  }, [chats])

  const active = chats.find((c) => c.id === activeId)

  function startVoice() {
    const SR =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition

    if (!SR) return

    const rec = new SR()

    rec.lang = "en-US"

    rec.onstart = () => setIsListening(true)

    rec.onend = () => setIsListening(false)

    rec.onresult = (e: any) => {
      setInput(e.results[0][0].transcript)
    }

    rec.start()
  }


  /* =========================================================
     SEND
  ========================================================= */

  async function send() {
    if (!input.trim() || !active || loading) return

    const q = input.trim()

    setInput("")
    setLoading(true)

    const selectedLevel =
      LEVELS.find((x) => x.id === level) || LEVELS[3]

    /*
      IMPORTANT:
      Original question stays visible to the user.

      API receives an instruction containing the selected level.
      This allows the existing /api/chat system to generate
      different depth answers without changing the UI.
    */

    const apiMessage = `
You are the AI teacher of NAWAZ AI ACADEMY.

The student selected this education level:

${selectedLevel.name}

LEVEL INSTRUCTION:
${selectedLevel.instruction}

IMPORTANT RULES:
1. Answer ONLY according to the selected education level.
2. Do not give university-level information to a Class 2 student.
3. Do not make a Class 2 answer unnecessarily complicated.
4. For younger students use simple words and easy examples.
5. For higher levels increase conceptual depth, terminology, formulas and applications appropriately.
6. Keep the answer educational and accurate.
7. Start with "Definition:" when a definition is useful.
8. Use "Key Points:" for important points.
9. Use "Example:" for an example when useful.
10. End with "NAWAZ AI ACADEMY".

STUDENT QUESTION:
${q}
`


    /* Create guaranteed local diagram */
    const diagramUrl = createDiagram(q, selectedLevel.name)


    /* Add question immediately */
    setChats((p) =>
      p.map((c) =>
        c.id === activeId
          ? {
              ...c,
              title:
                c.msgs.length === 0
                  ? q.slice(0, 25)
                  : c.title,

              msgs: [
                ...c.msgs,
                {
                  q,
                  a: "...",
                  diagram: diagramUrl,
                },
              ],
            }
          : c
      )
    )


    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: apiMessage,

          // Also send these separately for future API use
          question: q,
          level: selectedLevel.name,
          levelId: selectedLevel.id,
        }),
      })

      if (!res.ok) {
        throw new Error("API request failed")
      }

      const d = await res.json()

      const reply =
        d.reply ||
        "Sorry, I could not generate an answer. Please try again."

      setChats((p) =>
        p.map((c) =>
          c.id === activeId
            ? {
                ...c,
                msgs: c.msgs.map((m, i) =>
                  i === c.msgs.length - 1
                    ? {
                        ...m,
                        a: reply,
                        diagram: m.diagram,
                      }
                    : m
                ),
              }
            : c
        )
      )
    } catch (error) {
      console.error(error)

      setChats((p) =>
        p.map((c) =>
          c.id === activeId
            ? {
                ...c,
                msgs: c.msgs.map((m, i) =>
                  i === c.msgs.length - 1
                    ? {
                        ...m,
                        a:
                          "Sorry, there was a problem connecting to the AI. Please try again.",
                        diagram: m.diagram,
                      }
                    : m
                ),
              }
            : c
        )
      )
    } finally {
      setLoading(false)
    }
  }


  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <div
        style={{
          width: "280px",
          background: "#0a0a0a",
          color: "#fff",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontWeight: 900,
            textAlign: "center",
            padding: "12px 0",
          }}
        >
          NAWAZ AI ACADEMY
        </div>

        <button
          onClick={() => {
            const id = Date.now().toString()

            setChats((x) => [
              {
                id,
                title: "New Chat",
                msgs: [],
              },
              ...x,
            ])

            setActiveId(id)
          }}
          style={{
            padding: "12px",
            background: "#1a1a1a",
            color: "#fff",
            borderRadius: "12px",
            border: "1px solid #222",
          }}
        >
          + New Chat
        </button>

        <div
          style={{
            flex: 1,
            overflow: "auto",
            marginTop: "15px",
          }}
        >
          {chats.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveId(c.id)}
              style={{
                padding: "10px",
                background:
                  activeId === c.id
                    ? "#1e1e1e"
                    : "transparent",
                borderRadius: "10px",
                marginBottom: "6px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              {c.title}
            </div>
          ))}
        </div>
      </div>


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#fbfbfb",
        }}
      >

        <div
          style={{
            background: "#000",
            color: "#fff",
            padding: "12px",
            textAlign: "center",
            fontWeight: 700,
            fontSize: "13px",
          }}
        >
          NAWAZ PUBLICATION - NAWAZ AI ACADEMY
        </div>


        {/* =================================================
            CHAT AREA
        ================================================= */}

        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "20px",
            maxWidth: "900px",
            width: "100%",
            margin: "0 auto",
          }}
        >

          {active?.msgs.map((m, i) => (
            <div
              key={i}
              style={{
                marginBottom: "28px",
              }}
            >

              {/* QUESTION */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    background: "#111",
                    color: "#fff",
                    padding: "10px 16px",
                    borderRadius: "18px",
                  }}
                >
                  {m.q}
                </div>
              </div>


              {/* =================================================
                  ANSWER + DIAGRAM
              ================================================= */}

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                  marginTop: "12px",
                }}
              >

                {/* ANSWER */}

                <div
                  style={{
                    flex: "1 1 320px",
                    background: "#fff",
                    border: "1px solid #eee",
                    borderRadius: "16px",
                    padding: "16px",
                    boxShadow:
                      "0 4px 20px rgba(0,0,0,0.04)",
                  }}
                >
                  {m.a === "..." ? (
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "14px",
                      }}
                    >
                      Generating answer...
                    </div>
                  ) : (
                    <ColorfulAnswer text={m.a} />
                  )}
                </div>


                {/* =================================================
                    GUARANTEED DIAGRAM
                ================================================= */}

                {m.diagram && (
                  <div
                    style={{
                      flex: "0 1 320px",
                    }}
                  >
                    <img
                      src={m.diagram}
                      style={{
                        width: "100%",
                        display: "block",
                        background: "#fff",
                        borderRadius: "16px",
                        border: "1px solid #e5e7eb",
                        boxShadow:
                          "0 10px 30px rgba(0,0,0,0.08)",
                      }}
                      alt={`Educational diagram for ${m.q}`}
                    />

                    <div
                      style={{
                        fontSize: "11px",
                        color: "#888",
                        textAlign: "center",
                        marginTop: "6px",
                      }}
                    >
                      Diagram: {m.q} - NAWAZ AI ACADEMY
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}

        </div>


        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}

        <div
          style={{
            padding: "16px",
            background: "#fff",
            borderTop: "1px solid #f0f0f0",
          }}
        >

          <div
            style={{
              maxWidth: "860px",
              margin: "0 auto",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              background: "#f4f4f5",
              borderRadius: "9999px",
              padding: "8px 12px",
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.06)",
              border: "1px solid #e5e7eb",
            }}
          >

            {/* ATTACHMENT */}

            <button
              onClick={() => fileRef.current?.click()}
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                border: "none",
                background: "#fff",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.08)",
                cursor: "pointer",
                fontSize: "20px",
                flexShrink: 0,
              }}
            >
              📎
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{
                display: "none",
              }}
            />


            {/* VOICE */}

            <button
              onClick={startVoice}
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: isListening
                  ? "#ef4444"
                  : "#111",
                color: "#fff",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.15)",
                transition: "all 0.2s",
                transform: isListening
                  ? "scale(1.1)"
                  : "scale(1)",
                flexShrink: 0,
              }}
            >
              {isListening ? "●" : "🎙️"}
            </button>


            {/* =================================================
                EDUCATION LEVEL
            ================================================= */}

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              title="Select education level"
              style={{
                height: "42px",
                borderRadius: "12px",
                border: "1px solid #d1d5db",
                background: "#fff",
                color: "#111827",
                padding: "0 10px",
                outline: "none",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                maxWidth: "130px",
              }}
            >
              {LEVELS.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>


            {/* SEARCH INPUT */}

            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
