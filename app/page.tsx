export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* NAV BAR */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-base font-bold tracking-widest">
            LOGO
          </div>

          <div className="text-xs font-medium tracking-wider hover:opacity-60 transition cursor-pointer">
            LOGIN
          </div>
        </div>
      </div>

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* LEFT SIDE */}
          <div className="space-y-8">
            <div>
              <div className="text-xs font-bold tracking-widest mb-6 text-red-500">
                BADGE TEXT
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-none mb-4">
                MAIN
                <br />
                HEADING
              </h1>
              
              <p className="text-sm text-white/60 tracking-wide leading-relaxed max-w-md">
                Description text goes here. Add your message.
              </p>
            </div>

            {/* FORM */}
            <div className="space-y-4 max-w-md">
              <input
                placeholder="INPUT FIELD"
                className="w-full px-4 py-4 bg-white/5 border border-white/20 text-sm tracking-wider placeholder:text-white/40 outline-none focus:border-white/60 transition"
              />

              <button className="w-full py-4 bg-white text-black text-sm font-bold tracking-widest hover:bg-white/90 transition">
                BUTTON
              </button>

              <p className="text-[10px] text-white/40 tracking-wider">
                Small text here.
              </p>
            </div>

            {/* STATS */}
            <div className="flex gap-8 text-xs tracking-wider">
              <div>
                <div className="text-2xl font-bold mb-1">000</div>
                <div className="text-white/40">LABEL</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">000</div>
                <div className="text-white/40">LABEL</div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:pl-12">
            <div className="aspect-square bg-white/5 border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl font-black text-white/5">IMAGE</div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="text-xs tracking-widest text-white/60 mb-2">SUBTITLE</div>
                <div className="text-lg font-bold tracking-wide">TITLE TEXT</div>
              </div>
            </div>

            <div className="mt-4 text-xs tracking-wider text-white/40">
              Caption text
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <div className="border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-px bg-white/10">
            <div className="bg-black p-8">
              <div className="text-xs font-bold tracking-widest mb-3 text-red-500">
                01
              </div>
              <div className="text-base font-bold tracking-wide mb-2">
                TITLE
              </div>
              <div className="text-xs text-white/60 tracking-wide leading-relaxed">
                Description text here.
              </div>
            </div>

            <div className="bg-black p-8">
              <div className="text-xs font-bold tracking-widest mb-3 text-red-500">
                02
              </div>
              <div className="text-base font-bold tracking-wide mb-2">
                TITLE
              </div>
              <div className="text-xs text-white/60 tracking-wide leading-relaxed">
                Description text here.
              </div>
            </div>

            <div className="bg-black p-8">
              <div className="text-xs font-bold tracking-widest mb-3 text-red-500">
                03
              </div>
              <div className="text-base font-bold tracking-wide mb-2">
                TITLE
              </div>
              <div className="text-xs text-white/60 tracking-wide leading-relaxed">
                Description text here.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between text-[10px] tracking-widest text-white/40">
          <div>© {new Date().getFullYear()} BRAND</div>
          <div className="flex gap-6">
            <span className="hover:text-white transition cursor-pointer">LINK</span>
            <span className="hover:text-white transition cursor-pointer">LINK</span>
          </div>
        </div>
      </div>
    </main>
  );
}