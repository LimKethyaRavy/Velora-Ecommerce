import React from "react";
import CollectionSection from "./CollectionSection";
const CollectionCard = () => {
  const collections = [
    {
      id: 1,
      title: "Men Collection",
      description: "Light Layers, natural textures",
      image: "./src/assets/MenCollection.jpg",
    //   path: "/shop/denim-atelier",
      isNew: true,
      className: "col-span-2 lg:col-span-1 lg:row-span-2",
      imageClass: "aspect-[16/9] lg:aspect-[0.65]",
    },
    {
      id: 2,
      title: "Life Style",
      description: "After-dark dressing",
      image: "./src/assets/LifeStyle.jpg",
    //   path: "/shop/denim-atelier",
      className: "col-span-1",
      imageClass: "aspect-[1.13]",
    },

    {
      id: 3,
      title: "Woman Collection",
      description: "Washes, cuts, classics",
      image: "./src/assets/ea754f79c7f63bc94c64d319d3d2fe22.jpg",
    //   path: "/shop/denim-atelier",
      className: "col-span-1",
      imageClass: "aspect-[1.13]",
    },

    {
      id: 4,
      title: "Sinature Collection",
      description: "Refined fits, timeless style",
      image: "./src/assets/17911285967ee0739de456b98b23b59f.jpg",
    //   path: "/shop/tailoring-room",
      className: "col-span-2 lg:col-span-1 lg:col-start-2",
      imageClass: "aspect-[16/9] lg:aspect-[2.3]",
    },
      {
      id: 5,
      title: "Tech Collection",
      description: "Refined fits, timeless style",
      image: "./src/assets/Gemini_Generated_Image_jo2l9rjo2l9rjo2l.jpg",
    //   path: "/shop/tailoring-room",
      className: "col-span-2 lg:col-span-1 lg:col-start-3",
      imageClass: "aspect-[16/9] lg:aspect-[2.3]",
    },
  ];
  return (
    <div>
      <section className="bg-[#F5FOE9] py-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto mb-8">
          <p className="text-xs tracking-[0.25em] text-gray-500 uppercase">
            Discover your style
          </p>

          <h2 className="font-serif text-3xl md:text-4xl mt-2">
            Shop by Collection
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr] gap-x-3 md:gap-x-5 gap-y-6">
          {collections.map((collection) => (
            <CollectionSection key={collection.id} collection={collection} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CollectionCard;
