"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isNew?: boolean
}

export function ProductCard({
  name,
  price,
  originalPrice,
  image,
  category,
  isNew,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-300/50">
      {/* Image Container */}
      <div className="relative aspect-square bg-[#f8f6f3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-white hover:shadow-md"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isWishlisted ? "fill-gray-800 text-gray-800" : "text-gray-600"
            }`}
          />
        </button>

        {/* New Badge */}
        {isNew && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-gray-900 text-white text-xs font-semibold rounded-full">
            NEW
          </div>
        )}

        {/* Quick Add Button */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button className="w-full py-3 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
            Quick Add
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          {category}
        </p>
        
        {/* Name */}
        <h3 className="text-base font-semibold text-gray-900 mb-3 line-clamp-2">
          {name}
        </h3>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
