import { ProductCard } from "./product-card"

const products = [
  {
    id: "1",
    name: "Premium Whey Isolate",
    price: 59.99,
    originalPrice: 74.99,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&h=600&fit=crop",
    category: "Protein",
    isNew: true,
  },
  {
    id: "2",
    name: "Pre-Workout Elite Formula",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&h=600&fit=crop",
    category: "Performance",
    isNew: false,
  },
  {
    id: "3",
    name: "BCAA Recovery Complex",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&h=600&fit=crop",
    category: "Recovery",
    isNew: false,
  },
  {
    id: "4",
    name: "Creatine Monohydrate Pure",
    price: 29.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=600&fit=crop",
    category: "Performance",
    isNew: true,
  },
]

export function BestsellersSection() {
  return (
    <section id="bestsellers" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
            Bestsellers
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto text-pretty">
            Our most loved products, trusted by thousands of athletes worldwide.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:shadow-lg"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  )
}
