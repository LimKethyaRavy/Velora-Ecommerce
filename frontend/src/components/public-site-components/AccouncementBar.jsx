import React from "react";
import { ChevronDown, Globe, Tag } from "lucide-react";

const AccouncementBar = () => {
  return (
    <div>
      <div className="w-full bg-[#1c1c1c] text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="min-h-9 flex items-center justify-between">
            {/* Left: Empty space for desktop alignment */}
            <div className="hidden sm:block flex-1" />

            {/* Center: Promotion */}
            <div className="flex items-center justify-center gap-2 flex-1">
              <Tag size={13} className="shrink-0" />

              <p className="text-[10px] sm:text-xs tracking-wide whitespace-nowrap">
                Free shipping on orders over $100
              </p>
            </div>

            {/* Right: Account & Language */}
            <div className="hidden sm:flex items-center justify-end gap-4 flex-1 text-[11px]">
              <div className="flex items-center gap-2">
                <a
                  href="/login"
                  className="hover:text-gray-300 transition-colors"
                >
                  Login
                </a>

                <span className="text-gray-500">|</span>

                <a
                  href="/register"
                  className="hover:text-gray-300 transition-colors"
                >
                  Register
                </a>
              </div>

              <div className="flex items-center gap-1 cursor-pointer hover:text-gray-300 transition-colors">
                <Globe size={13} />
                <span>English</span>
                <ChevronDown size={12} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccouncementBar;
