// makeRealDiagram والا فنکشن اس سے بدل دیں

function getRealBookDiagram(topic: string) {
  const t = topic.toLowerCase()

  // یہ ہماری کتابوں والی اصلی ڈایا گرام ہیں
  const realDiagrams: any = {
    "photosynthesis": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/93/Photosynthesis.svg/800px-Photosynthesis.svg.png",
    "heart": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Diagram_of_the_human_heart.svg/800px-Diagram_of_the_human_heart.svg.png",
    "cell": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Animal_cell_structure_en.svg/800px-Animal_cell_structure_en.svg.png",
    "plant cell": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Plant_cell_structure-en.svg/800px-Plant_cell_structure-en.svg.png",
    "water cycle": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Water_cycle.svg/800px-Water_cycle.svg.png",
    "dna": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/DNA_chemical_structure.svg/800px-DNA_chemical_structure.svg.png",
    "atom": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Atom_Diagram.svg/600px-Atom_Diagram.svg.png",
  }

  for (let key in realDiagrams) {
    if (t.includes(key)) {
      return realDiagrams[key]
    }
  }
  // اگر کوئی نیا ٹاپک ہو تو تب AI والی اصلی کتاب جیسی بنے گی
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(`professional biology textbook labeled diagram of ${topic}, highly detailed, colorful, cross section, white background, educational illustration`)}?width=1024&height=768&model=flux&nologo=true&seed=${Date.now()}`
}

// اور send() میں:
let diagramUrl = null
if (d.needsDiagram) {
  diagramUrl = getRealBookDiagram(q)
}
