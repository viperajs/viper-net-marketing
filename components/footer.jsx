"use client"

import { Facebook, Instagram, Twitter, Linkedin, Github } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[#1a1a1a] bg-gradient-to-b from-black to-[#0a0a0a] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00b5ad] to-[#00d4c4] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="text-xl font-bold text-white">Viper Net</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">Professional digital solutions for your business</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {["Web Design", "SEO Optimization", "Online Stores", "Digital Marketing", "Support & Hosting"].map(
                (item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-[#14B8A6] transition-all duration-300 text-sm inline-block hover:translate-x-1">
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {["Home", "Projects", "About Us", "Blog"].map((item) => (
                <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-[#14B8A6] transition-all duration-300 text-sm inline-block hover:translate-x-1">
                      {item}
                    </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <a
                href="https://x.com/e_balakchiev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-[#14B8A6] transition-colors text-sm"
              >
                <Twitter size={16} />
                @e_balakchiev (ViperNet)
              </a>
              <a
                href="https://www.linkedin.com/in/ediz-balakchiev-87026b363/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-[#14B8A6] transition-colors text-sm"
              >
                <Linkedin size={16} />
               Ediz Balakchiev
              </a>
              <a
                href="https://github.com/balakchiev12"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-[#14B8A6] transition-colors text-sm"
              >
                <Github size={16} />
                balakchiev12
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1a1a1a] pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© {currentYear} Viper Net — All rights reserved.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <a 
                href="https://x.com/e_balakchiev" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-[#14B8A6]/10 text-[#14B8A6] hover:bg-[#14B8A6]/20 transition-all duration-300 hover:scale-110 hover:rotate-6 active:scale-95" 
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://www.linkedin.com/in/ediz-balakchiev-87026b363/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-[#14B8A6]/10 text-[#14B8A6] hover:bg-[#14B8A6]/20 transition-all duration-300 hover:scale-110 hover:rotate-6 active:scale-95" 
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://github.com/balakchiev12" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-[#14B8A6]/10 text-[#14B8A6] hover:bg-[#14B8A6]/20 transition-all duration-300 hover:scale-110 hover:rotate-6 active:scale-95" 
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


