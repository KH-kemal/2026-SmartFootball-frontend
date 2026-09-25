import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, ChevronRight, Heart } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Daftar Tim', href: '/teams' },
    { name: 'Daftar Pemain', href: '/players' },
    { name: 'Jadwal & Skor', href: '/fixtures' },
    { name: 'Klasemen', href: '/league-table' },
    { name: 'Leaderboard', href: '/leaderboard' },
  ];

  const features = [
    { title: 'Sistem Pointing', desc: 'Perhitungan otomatis poin performa pemain secara objektif.' },
    { title: 'Leaderboard Terkini', desc: 'Daftar pemain terbaik berdasarkan performa riil di lapangan.' },
    { title: 'Analisis Kekuatan Tim', desc: 'Informasi mendalam mengenai performa kolektif dan taktik tim.' },
    { title: 'Jadwal & Skor Real-Time', desc: 'Pembaruan jadwal pertandingan dan skor secara langsung.' },
  ];

  const socialLinks = [
    {
      icon: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
          alt="Instagram"
          className="w-5 h-5 object-contain"
        />
      ),
      href: 'https://instagram.com',
      label: 'Instagram',
      bgClass: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:via-red-500 hover:to-purple-600 hover:border-transparent hover:shadow-lg hover:shadow-red-500/20'
    },
    {
      icon: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg"
          alt="Twitter / X"
          className="w-4 h-4 object-contain brightness-0 invert"
        />
      ),
      href: 'https://twitter.com',
      label: 'Twitter',
      bgClass: 'hover:bg-white hover:text-black hover:border-transparent hover:shadow-lg hover:shadow-white/20'
    },
    {
      icon: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
          alt="Github"
          className="w-5 h-5 object-contain brightness-0 invert"
        />
      ),
      href: 'https://github.com',
      label: 'Github',
      bgClass: 'hover:bg-white hover:text-black hover:border-transparent hover:shadow-lg hover:shadow-white/20'
    },
    {
      icon: (
        <img
          src="https://img.icons8.com/color/48/domain.png"
          alt="Website"
          className="w-5 h-5 object-contain"
        />
      ),
      href: '#',
      label: 'Website',
      bgClass: 'hover:bg-primary hover:border-transparent hover:shadow-lg hover:shadow-primary/20'
    },
  ];

  return (
    <footer className="relative mt-auto shrink-0 bg-gradient-to-br from-[#0c0624] via-[#120736] to-[#070318] text-slate-300 border-t border-primary/20 transition-all duration-300 overflow-hidden">
      {/* Decorative top gradient glowing line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>

      {/* Subtle radial overlay for glassmorphism and depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.06),transparent_60%)] pointer-events-none"></div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          
          {/* Column 1: Brand Info & Socials */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group w-fit">
              <img 
                src="/logo.png" 
                alt="SmartFootball Logo" 
                className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md" 
              />
              <span className="font-black text-xl tracking-tight text-white transition-colors duration-300">
                Smart<span className="text-primary-light">Football</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Platform analisis sepak bola modern untuk memantau performa pemain, jadwal pertandingan, klasemen liga, dan leaderboard skor secara real-time.
            </p>
            {/* Social Icons with Images */}
            <div className="flex items-center space-x-3.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 transition-all duration-300 hover:scale-110 active:scale-95 ${social.bgClass}`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-8 after:h-[2px] after:bg-primary-light">
              Navigasi Cepat
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="group flex items-center text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-300"
                  >
                    <ChevronRight size={14} className="mr-1 text-slate-500 group-hover:text-primary-light transition-transform duration-300 group-hover:translate-x-1" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Features */}
          <div className="space-y-6">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-8 after:h-[2px] after:bg-primary-light">
              Fitur Unggulan
            </h3>
            <ul className="space-y-4">
              {features.map((feature) => (
                <li key={feature.title} className="group">
                  <h4 className="text-sm font-bold text-slate-300 transition-colors duration-300 group-hover:text-primary-light">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {feature.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact / Address */}
          <div className="space-y-6">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-8 after:h-[2px] after:bg-primary-light">
              Hubungi Kami
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin size={18} className="text-primary-light mt-0.5 shrink-0 stroke-[2]" />
                <span className="leading-relaxed text-slate-400">Jakarta, Indonesia</span>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <Mail size={18} className="text-primary-light mt-0.5 shrink-0 stroke-[2]" />
                <a href="mailto:support@smartfootball.com" className="text-slate-400 hover:text-white transition-colors duration-300">
                  support@smartfootball.com
                </a>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <Phone size={18} className="text-primary-light mt-0.5 shrink-0 stroke-[2]" />
                <a href="tel:+6281234567890" className="text-slate-400 hover:text-white transition-colors duration-300">
                  +62 812-3456-7890
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-black/30 py-4 relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400 font-semibold">
            <span>&copy; {new Date().getFullYear()} SmartFootball. Dibuat dengan</span>
            <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
            <span>untuk pencinta sepak bola.</span>
          </div>
          <div className="flex space-x-6 text-slate-400">
            <a href="#" className="hover:text-white transition-colors duration-300 font-semibold">
              Kebijakan Privasi
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300 font-semibold">
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
