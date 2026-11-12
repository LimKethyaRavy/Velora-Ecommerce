import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
const slides = [
  {
    id: 1,
    subtitle: "NEW COLLECTION 2026",
    title: "Timeless Style,\nModern You.",
    description:
      "Discover our latest collection of carefully curated fashion pieces designed to elevate your everyday style.",
    button: "Shop Collection",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=85&w=2000&auto=format&fit=crop",
  },
  {
    id: 2,
    subtitle: "ELEVATE YOUR WARDROBE",
    title: "Elegance in\nEvery Detail.",
    description:
      "Explore sophisticated essentials and timeless pieces made for every occasion.",
    button: "Explore Now",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=85&w=2000&auto=format&fit=crop",
  },
  {
    id: 3,
    subtitle: "THE SEASONAL EDIT",
    title: "Find Your\nOwn Expression.",
    description:
      "Express your personality with our latest selection of contemporary fashion.",
    button: "Discover More",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=85&w=2000&auto=format&fit=crop",
  },
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const activeSlide = slides[currentSlide];

  return (
    <section className="w-full bg-[#f5f1ec]">
      <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] overflow-hidden">
        {/* Background Image */}
        <img
          key={activeSlide.id}
          src={activeSlide.image}
          alt="VELORA fashion collection"
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center">
          <div className="max-w-[600px] text-white">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#d5bda3]" />

              <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#e4d1bd]">
                {activeSlide.subtitle}
              </p>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl leading-[1.08] tracking-tight whitespace-pre-line mb-6">
              {activeSlide.title}
            </h1>

            <p className="text-sm sm:text-base text-white/80 leading-7 max-w-[450px] mb-9">
              {activeSlide.description}
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center gap-5 bg-white text-[#1c1c1c] px-7 py-4 text-xs font-semibold tracking-widest uppercase hover:bg-[#d5bda3] transition-colors duration-300"
            >
              {activeSlide.button}
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-7 right-6 sm:right-10 lg:right-16 z-20 flex items-center gap-5">
          {/* Slide Number */}
          <p className="text-white text-xs tracking-widest">
            0{currentSlide + 1}
            <span className="text-white/40 mx-2">/</span>0{slides.length}
          </p>

          {/* Previous */}
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-10 h-10 sm:w-12 sm:h-12 border border-white/50 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Next */}
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-10 h-10 sm:w-12 sm:h-12 border border-white/50 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-9 left-6 sm:left-10 lg:left-16 z-20 flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-[3px] transition-all duration-300 ${
                currentSlide === index ? "w-10 bg-white" : "w-5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
