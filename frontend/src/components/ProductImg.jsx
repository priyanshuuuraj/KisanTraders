import React, { useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ProductImg = ({ images }) => {
  const [mainImg, setMainImg] = useState(images?.[0]?.url);

  return (
    <div className="flex gap-4">

      {/* Thumbnails */}
      <div className="flex flex-col gap-2.5">
        {images?.map((img, index) => (
          <button
            key={index}
            onClick={() => setMainImg(img.url)}
            className="w-16 h-16 rounded-xl overflow-hidden transition-all duration-150 flex-shrink-0"
            style={{
              border: mainImg === img.url
                ? "2px solid #3d6b40"
                : "2px solid rgba(143,185,122,0.2)",
              boxShadow: mainImg === img.url
                ? "0 0 0 3px rgba(61,107,64,0.12)"
                : "none",
              background: "#f5f0e8",
            }}
          >
            <img
              src={img.url}
              alt={`thumb-${index}`}
              className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="rounded-2xl overflow-hidden"
        style={{
          border: "1px solid rgba(143,185,122,0.2)",
          background: "#faf7f2",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        }}>
        <Zoom>
          <img
            src={mainImg}
            alt="product"
            className="w-[460px] object-cover"
            style={{ display: "block" }}
          />
        </Zoom>
      </div>

    </div>
  );
};

export default ProductImg;