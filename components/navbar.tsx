"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Menu, X, ShoppingBag, User, Search, ChevronDown, Heart } from "lucide-react"
import { TurkeyFlag, USAFlag, UKFlag, EUFlag } from "./flag-icons"

const countries = [
  { code: "TR", name: "Türkiye", Flag: TurkeyFlag },
  { code: "US", name: "United States", Flag: USAFlag },
  { code: "UK", name: "United Kingdom", Flag: UKFlag },
  { code: "EU", name: "Europe", Flag: EUFlag },
]

const megaMenuData: Record<string, { categories: { title: string; items: string[] }[]; featured: { image: string; title: string } }> = {
  Proteins: {
    categories: [
      { title: "TRENDING", items: ["All Proteins", "New Arrivals", "Best Sellers", "Limited Edition"] },
      { title: "WHEY PROTEIN", items: ["Whey Isolate", "Whey Concentrate", "Whey Blend", "Hydrolyzed Whey"] },
      { title: "PLANT BASED", items: ["Pea Protein", "Soy Protein", "Rice Protein", "Hemp Protein"] },
      { title: "CASEIN", items: ["Micellar Casein", "Casein Blend", "Night Time Formula"] },
    ],
    featured: { image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop", title: "PROTEINS" }
  },
  Performance: {
    categories: [
      { title: "TRENDING", items: ["All Performance", "New Drops", "Best Sellers", "Bundles"] },
      { title: "PRE-WORKOUT", items: ["High Stimulant", "Stim Free", "Pump Formula", "Focus Blend"] },
      { title: "CREATINE", items: ["Creatine Monohydrate", "Creatine HCL", "Creatine Blend"] },
      { title: "AMINO ACIDS", items: ["BCAAs", "EAAs", "Glutamine", "Beta-Alanine"] },
    ],
    featured: { image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop", title: "PERFORMANCE" }
  },
  Wellness: {
    categories: [
      { title: "TRENDING", items: ["All Wellness", "New Arrivals", "Best Sellers", "Gift Sets"] },
      { title: "VITAMINS", items: ["Multivitamins", "Vitamin D", "Vitamin C", "B-Complex"] },
      { title: "MINERALS", items: ["Magnesium", "Zinc", "Iron", "Calcium"] },
      { title: "HEALTH", items: ["Omega-3", "Probiotics", "Sleep Support", "Immunity"] },
    ],
    featured: { image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&h=300&fit=crop", title: "WELLNESS" }
  },
  Explore: {
    categories: [
      { title: "ABOUT US", items: ["Our Story", "Mission & Values", "Athletes", "Sustainability"] },
      { title: "SUPPORT", items: ["Contact Us", "FAQs", "Shipping Info", "Returns"] },
      { title: "COMMUNITY", items: ["Blog", "Recipes", "Workout Tips", "Success Stories"] },
      { title: "REWARDS", items: ["Loyalty Program", "Refer a Friend", "Student Discount", "Military Discount"] },
    ],
    featured: { image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop", title: "EXPLORE" }
  },
}

const navItems = ["Proteins", "Performance", "Wellness", "Explore"]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(countries[0])
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const countryRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Scroll detection for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current)
      }
    }
  }, [])

  const handleMenuEnter = useCallback((item: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current)
      menuTimeoutRef.current = null
    }
    setActiveMenu(item)
  }, [])

  const handleMenuLeave = useCallback(() => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 300) // 300ms delay before closing
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        activeMenu 
          ? 'bg-white border-b border-gray-200' 
          : isScrolled 
            ? 'bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50' 
            : 'bg-gray-950/40 backdrop-blur-sm'
      }`}>
        {/* Promo Banner */}
        <div className="bg-gray-950 text-white text-center py-2 text-sm">
          Get 10% off your first order when you sign up to our emails
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex items-center h-14 lg:h-16">
            {/* Left Navigation */}
            <div 
              ref={navRef}
              className="hidden lg:flex items-center gap-6"
              onMouseLeave={handleMenuLeave}
            >
              {navItems.map((item) => (
                <div
                  key={item}
                  className="relative py-2"
                  onMouseEnter={() => handleMenuEnter(item)}
                >
                  <a
                    href="#"
                    className={`text-sm font-medium transition-all duration-200 hover:scale-105 inline-block ${
                      activeMenu 
                        ? activeMenu === item 
                          ? 'text-gray-900 border-b-2 border-gray-900' 
                          : 'text-gray-600 border-b-2 border-transparent'
                        : isScrolled
                          ? 'text-white/90 hover:text-white border-b-2 border-transparent'
                          : 'text-white border-b-2 border-transparent'
                    }`}
                  >
                    {item}
                  </a>
                </div>
              ))}
            </div>

            {/* Center Logo */}
            <div className="flex-1 flex justify-center lg:absolute lg:left-1/2 lg:-translate-x-1/2">
              <a href="/" className="flex items-center">
                <span className={`text-2xl lg:text-3xl font-bold tracking-tight transition-colors duration-300 ${
                  activeMenu ? 'text-gray-900' : 'text-white'
                }`}>
                  VAGUE
                </span>
              </a>
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-1 ml-auto">
              {/* Search Bar */}
              <div className="relative mr-2">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                  activeMenu ? 'text-gray-400' : 'text-white/60'
                }`} />
                <input
                  type="text"
                  placeholder="What are you looking for today..."
                  className={`w-64 pl-10 pr-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                    activeMenu 
                      ? 'bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-gray-300' 
                      : 'bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-white/30'
                  }`}
                />
              </div>

              <button className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-105 ${
                activeMenu 
                  ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}>
                <Heart className="w-5 h-5" />
              </button>
              <button className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-105 ${
                activeMenu 
                  ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}>
                <User className="w-5 h-5" />
              </button>
              
              {/* Country Selector */}
              <div ref={countryRef} className="relative">
                <button
                  onClick={() => setIsCountryOpen(!isCountryOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    activeMenu 
                      ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <selectedCountry.Flag className="w-5 h-4 rounded-sm overflow-hidden" />
                  <span className={`text-sm font-medium ${activeMenu ? 'text-gray-700' : 'text-white/90'}`}>
                    {selectedCountry.code}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCountryOpen ? 'rotate-180' : ''} ${activeMenu ? 'text-gray-500' : 'text-white/60'}`} />
                </button>

                {isCountryOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50">
                    {countries.map((country) => {
                      const FlagComponent = country.Flag
                      return (
                        <button
                          key={country.code}
                          onClick={() => {
                            setSelectedCountry(country)
                            setIsCountryOpen(false)
                          }}
                          className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                            selectedCountry.code === country.code ? 'bg-gray-100' : ''
                          }`}
                        >
                          <FlagComponent className="w-6 h-4 rounded-sm flex-shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{country.code}</span>
                            <span className="text-xs text-gray-500">{country.name}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <button className={`relative p-2.5 rounded-lg transition-all duration-200 hover:scale-105 ${
                activeMenu 
                  ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}>
                <ShoppingBag className="w-5 h-5" />
                <span className={`absolute top-1 right-1 w-4 h-4 text-[10px] font-medium rounded-full flex items-center justify-center ${
                  activeMenu ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                }`}>
                  0
                </span>
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2 ml-auto">
              <button className="p-2 text-white/80 hover:text-white">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-white/80 hover:text-white">
                <Heart className="w-5 h-5" />
              </button>
              <button className="relative p-2 text-white/80 hover:text-white">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-white text-gray-900 text-[10px] font-medium rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-white/80 hover:text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        {activeMenu && megaMenuData[activeMenu] && (
          <div 
            className="absolute left-0 right-0 bg-white border-t border-gray-200 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => handleMenuEnter(activeMenu)}
            onMouseLeave={handleMenuLeave}
          >
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8">
              <div className="grid grid-cols-5 gap-8">
                {/* Categories */}
                {megaMenuData[activeMenu].categories.map((category, idx) => (
                  <div key={idx}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      {category.title}
                    </h3>
                    <ul className="space-y-3">
                      {category.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          <a 
                            href="#" 
                            className="text-sm text-gray-700 hover:text-gray-900 hover:underline transition-all duration-200 hover:scale-105 inline-block"
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Featured Image */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    FEATURED
                  </h3>
                  <div className="relative rounded-lg overflow-hidden group cursor-pointer">
                    <img
                      src={megaMenuData[activeMenu].featured.image}
                      alt={megaMenuData[activeMenu].featured.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-4 left-4 text-white font-bold text-lg">
                      {megaMenuData[activeMenu].featured.title}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <details key={item} className="group">
                  <summary className="flex items-center justify-between text-base font-medium text-gray-900 cursor-pointer list-none">
                    {item}
                    <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-3 pl-4 space-y-3">
                    {megaMenuData[item]?.categories.map((category, idx) => (
                      <div key={idx} className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase">{category.title}</h4>
                        {category.items.map((subItem, subIdx) => (
                          <a key={subIdx} href="#" className="block text-sm text-gray-600 hover:text-gray-900">
                            {subItem}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                </details>
              ))}
              
              {/* Mobile Country Selector */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Select Region</p>
                <div className="flex flex-wrap gap-2">
                  {countries.map((country) => {
                    const FlagComponent = country.Flag
                    return (
                      <button
                        key={country.code}
                        onClick={() => setSelectedCountry(country)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                          selectedCountry.code === country.code 
                            ? 'bg-gray-900 text-white border-gray-900' 
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <FlagComponent className="w-5 h-4 rounded-sm" />
                        <span className="text-sm font-medium">{country.code}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-[88px] lg:h-[96px]" />
    </>
  )
}
