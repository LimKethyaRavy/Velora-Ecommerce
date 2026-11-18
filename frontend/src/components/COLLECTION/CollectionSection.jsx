import React from "react";
import { Link } from "react-router-dom";

const CollectionSection = ({ collection }) => {
  return (
    <div className={collection.className}>
      <Link
        to={collection.path}
        className="group block min-w-0"
        aria-label={`Shop ${collection.title}`}
      >
        {/* Image */}

        
        <div
          className={`relative overflow-hidden bg-[#D9CBB8] ${collection.imageClass}`}
        >
          <img
            src={collection.image}
            alt={collection.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* New Badge */}
          {collection.isNew && (
            <span className="absolute top-3 left-3 bg-[#A45B3C] text-white text-[10px] tracking-widest px-3 py-1">
              NEW
            </span>
          )}
        </div>

        {/* Collection Information */}
        <div className="flex justify-between items-start gap-2 mt-3">
          <div>
            <h3 className="font-serif text-xl text-[#252525]">
              {collection.title}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {collection.description}
            </p>
          </div>

          <span className="text-xs whitespace-nowrap mt-2 group-hover:underline underline-offset-4">
            Shop →
          </span>
        </div>
      </Link>
   
    </div>
  );
};

export default CollectionSection;
