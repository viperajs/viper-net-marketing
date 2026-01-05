"use client"

import {  Twitter, Linkedin, Github } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/20 bg-black/40 backdrop-blur-sm py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">V</span>
              </div>
              <span className="text-xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Viper Net</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">Professional digital solutions for your business</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Contact</h4>
            <div className="space-y-3">
              <a
                href="https://x.com/e_balakchiev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
              >
                <Twitter size={16} />
                @Viper
              </a>
              <a
                href="https://www.linkedin.com/in/ediz-balakchiev-87026b363/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
              >
                <Linkedin size={16} />
                Ediz Balakchiev
              </a>
              <a
                href="https://github.com/viperajs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
              >
                <Github size={16} />
                viperajs
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-white/70 text-sm">© {currentYear} Viper Net — All rights reserved.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <a 
                href="https://x.com/e_balakchiev" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-6 active:scale-95" 
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://www.linkedin.com/in/ediz-balakchiev-87026b363/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-6 active:scale-95" 
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://github.com/viperajs" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-6 active:scale-95" 
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}



