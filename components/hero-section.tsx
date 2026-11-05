"use client"

import { useState, useEffect } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    title: "Your easiest",
    titleHighlight: "daily upgrade.",
    subtitle: "One scoop, once a day",
    cta: "Start the Habit",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
    title: "Fuel Your",
    titleHighlight: "Potential.",
    subtitle: "Premium supplements for peak performance",
    cta: "Shop Now",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    title: "Train Hard,",
    titleHighlight: "Recover Faster.",
    subtitle: "Science-backed formulas for athletes",
    cta: "Explore Products",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="max-w-xl">
                <h1 
                  className={`text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 transition-all duration-700 ${
                    index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: "200ms" }}
                >
                  {slide.title}
                  <span className="block">{slide.titleHighlight}</span>
                </h1>
                
                <p 
                  className={`text-lg sm:text-xl text-gray-300 mb-8 transition-all duration-700 ${
                    index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: "400ms" }}
                >
                  {slide.subtitle}
                </p>
                
                <a
                  href="#bestsellers"
                  className={`inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:shadow-lg group ${
                    index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: "600ms" }}
                >
                  {slide.cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "w-8 bg-white" 
                : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Promo Banner */}
      <div className="absolute top-20 lg:top-24 left-0 right-0 flex justify-center">
        <div className="px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full">
          <p className="text-sm text-gray-200">
            <span className="text-gray-400">{"🔥 "}</span>
            Up to 60% off complete nutrition {">>"}
          </p>
        </div>
      </div>
    </section>
  )
}
