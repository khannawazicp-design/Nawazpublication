export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFBEB] text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-black">Nawaz<span className="text-amber-600">Publication</span></h1>
          <a href="https://wa.me/923000000000" className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">WhatsApp</a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-black leading-tight">
          AI-Powered Notes for <br/> <span className="text-amber-600">Every Student</span>
        </h2>
        <p className="mt-4 text-lg text-gray-600">Urdu | English | Pashto | Auto Language: اردو / پښتو / English</p>
        <div className="mt-6 flex justify-center gap-3">
          <input placeholder="Matrix, 9th Class..." className="border px-4 py-3 rounded-lg w-64" />
          <button className="bg-black text-white px-6 py-3 rounded-lg">Search</button>
        </div>
        <p className="mt-3 text-sm text-gray-500">NawazPublication.com</p>
      </section>

      {/* Books */}
      <section className="max-w-6xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Urdu Notes 9th - 12th", lang: "اردو", color: "bg-green-100" },
          { title: "English Grammar & Essays", lang: "English", color: "bg-blue-100" },
          { title: "Pashto Notes & Literature", lang: "پښتو", color: "bg-amber-100" },
        ].map((book, i) => (
          <div key={i} className={`${book.color} p-6 rounded-2xl`}>
            <div className="bg-white h-48 rounded-xl mb-4 flex items-center justify-center text-5xl">📚</div>
            <span className="text-xs bg-black text-white px-2 py-1 rounded">{book.lang}</span>
            <h3 className="font-bold text-xl mt-2">{book.title}</h3>
            <p className="text-sm text-gray-600 mt-1">AI Powered | To-the-point | Exam Ready</p>
            <button className="mt-4 w-full bg-black text-white py-2.5 rounded-lg font-bold">Order Now - Rs. 500</button>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-8">
        <p className="font-bold">Nawaz Publication © 2026</p>
        <p className="text-sm text-gray-400 mt-1">Lahore, Pakistan | AI-Powered Education</p>
      </footer>
    </main>
  );
}
