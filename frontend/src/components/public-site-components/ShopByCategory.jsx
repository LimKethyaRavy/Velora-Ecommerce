
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ShopByCategory = () => {
  const categories = [
    {
      id: 1,
      title: "Men",
      image: "../src/assets/72796142-b595-4102-b632-1723e94d79f9.jpg",
      path: "/shop/men",
    },
    {
      id: 2,
      title: "Women",
      image: "../src/assets/sdf.jpg",
      path: "/shop/women",
    },
    {
      id: 3,
      title: "Bags",
      image: "../src/assets/bag.jpg",
      path: "/shop/bags",
    },
    {
      id: 4,
      title: "Shoes",
      image: "/images/categories/shoes.jpg",
      path: "/shop/shoes",
    },
    {
      id: 5,
      title: "Accessories",
      image: "/images/categories/accessories.jpg",
      path: "/shop/accessories",
    },
    {
      id: 6,
      title: "Sunglasses",
      image: "/images/categories/sunglasses.jpg",
      path: "/shop/sunglasses",
    },
    {
      id: 7,
      title: "Lifestyle",
      image: "/images/categories/lifestyle.jpg",
      path: "/shop/lifestyle",
    },
    {
      id: 8,
      title: "Essentials",
      image: "/images/categories/essentials.jpg",
      path: "/shop/essentials",
    },
  ];

  return (
    <section className="w-full bg-[#faf8f5] py-8 sm:py-10">

     
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">
            Shop by Category
          </h2>

          <Link
            to="/categories"
            className="flex items-center gap-2 text-xs font-medium
            text-gray-700 hover:text-black transition"
          >
            View All Categories
            <ArrowRight size={15} />
          </Link>

        </div>

      
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-y-6 gap-x-3">

          {categories.map((item) => (
            <Link
              to={item.path}
              key={item.id}
              className="flex flex-col items-center group"
            >

    
              <div className="w-16 h-16 sm:w-20 sm:h-20
                rounded-full overflow-hidden bg-[#eee3d9]
                transition-transform duration-300
                group-hover:scale-105"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

        
              <p className="mt-2 text-xs sm:text-sm text-gray-800
                font-medium text-center group-hover:text-black">
                {item.title}
              </p>

            </Link>
          ))}

        </div>

      </div>
    </section>
  );
};

export default ShopByCategory;
