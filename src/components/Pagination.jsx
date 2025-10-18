import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="flex justify-between items-center mt-6">
      <p className="text-sm text-gray-500">
        Page {page} of {totalPages}
      </p>

      <div className="flex gap-3">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm border transition-all ${
            page === 1
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-[#1A2980] border-gray-300 hover:bg-gray-50"
          }`}
        >
          <ChevronLeft size={16} /> Prev
        </button>

        <button
          onClick={onNext}
          disabled={page === totalPages}
          className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm border transition-all ${
            page === totalPages
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-[#1A2980] border-gray-300 hover:bg-gray-50"
          }`}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
