"use client"

export default function Hero() {
  // Премахнато canvas анимацията за да се вижда liquid chrome фона

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Премахнато canvas и тъмния оверлей за да се вижда liquid chrome фона */}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 inline-block animate-fade-in-down">
          <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white text-sm font-medium animate-pulse-slow drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Digital solutions for your business
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up stagger-1 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          Building{" "}
          <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] animate-float">
            modern websites
          </span>{" "}
          at affordable prices
        </h1>

        <p className="text-lg sm:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up stagger-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          Transform your business with professional web solutions, SEO optimization, and digital marketing
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3">
          <a 
            href="#our-process"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('our-process');
              if (element) {
                const headerHeight = 80;
                const targetPosition = element.offsetTop - headerHeight;
                window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
                });
              }
            }}
            className="px-8 py-4 border-2 border-white/50 text-white rounded-lg font-bold transition-all duration-300 hover:bg-white/10 hover:border-white hover:shadow-lg hover:shadow-white/20 hover:scale-105 active:scale-95 backdrop-blur-sm drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] cursor-pointer inline-block text-center"
          >
            How We Work
          </a>
        </div>
      </div>
    </section>
  )
}



