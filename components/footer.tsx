"use client"

import { MapPin, Mail, Instagram, Facebook, Twitter, Youtube, ArrowRight } from "lucide-react"
import { VisaIcon, MastercardIcon, PayPalIcon, ApplePayIcon, GooglePayIcon, AppStoreButton, GooglePlayButton } from "./payment-icons"

const footerLinks = {
  shop: {
    title: "MAGAZA",
    items: ["Protein", "Pre-Workout", "Creatine", "Giyim", "Aksesuarlar"]
  },
  support: {
    title: "DESTEK",
    items: ["SSS", "Kargo Bilgisi", "Iade & Degisim", "Siparis Takibi", "Iletisim"]
  },
  policies: {
    title: "POLITIKALAR",
    items: ["Kullanim Kosullari", "Gizlilik Politikasi", "Cerez Politikasi", "Iade Politikasi", "Ogrenci Indirimi"]
  }
}

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <a href="/" className="inline-block mb-6">
              <span className="text-3xl font-bold tracking-tight text-white">
                VAGUE
              </span>
            </a>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Ortalamaya razi olmayan sporcular icin premium spor beslenmesi.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">
              BIZIMLE ILETISIM
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-400 leading-relaxed">
                  Barbaros Mahallesi,<br />
                  Besiktas<br />
                  Istanbul, Turkiye 34353
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <a href="mailto:support@vaguesport.com" className="text-sm text-gray-400 hover:text-white transition-colors">
                  support@vaguesport.com
                </a>
              </div>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">
              {footerLinks.shop.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.items.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">
              {footerLinks.support.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.items.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies Column */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">
              {footerLinks.policies.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.policies.items.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & App Column */}
          <div className="lg:col-span-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">
              ILK SIPARISINIZDE %10 INDIRIM
            </h3>
            <div className="relative mb-8">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 pr-12 bg-transparent border border-gray-700 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-gray-900 rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              DOWNLOAD OUR APP
            </h4>
            <div className="space-y-3">
              <a href="#" className="block hover:opacity-90 transition-opacity">
                <AppStoreButton className="w-full h-auto" />
              </a>
              <a href="#" className="block hover:opacity-90 transition-opacity">
                <GooglePlayButton className="w-full h-auto" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; 2026 Vague Sport. All rights reserved.
            </p>
            
            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <VisaIcon className="h-8 w-auto" />
              <MastercardIcon className="h-8 w-auto" />
              <PayPalIcon className="h-8 w-auto" />
              <ApplePayIcon className="h-8 w-auto" />
              <GooglePayIcon className="h-8 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
