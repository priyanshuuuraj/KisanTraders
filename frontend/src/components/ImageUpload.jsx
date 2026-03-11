import React, { useRef, useState } from "react";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { X, UploadCloud, ImagePlus } from "lucide-react";

const ImageUpload = ({ productData, setProductData }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    const arr = Array.from(files || []);
    if (arr.length > 0) {
      setProductData((prev) => ({
        ...prev,
        productImg: [...prev.productImg, ...arr],
      }));
    }
  };

  const onInputChange = (e) => handleFiles(e.target.files);

  const removeImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      productImg: prev.productImg.filter((_, i) => i !== index),
    }));
  };

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="grid gap-3">
      <Label className="text-sm font-semibold" style={{ color: "#2d4a2e" }}>
        Product Images
      </Label>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={onInputChange}
      />

      {/* Upload Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className="cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center py-8 px-4 gap-3 select-none"
        style={{
          borderColor: dragging ? "#3d6b40" : "rgba(143,185,122,0.4)",
          background: dragging ? "rgba(143,185,122,0.06)" : "rgba(143,185,122,0.02)",
        }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-200"
          style={{
            background: dragging ? "rgba(143,185,122,0.2)" : "rgba(143,185,122,0.1)",
            color: "#3d6b40",
            transform: dragging ? "scale(1.1)" : "scale(1)",
          }}
        >
          <UploadCloud className="w-6 h-6" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold" style={{ color: "#2d4a2e" }}>
            Click to upload
            <span className="hidden sm:inline"> or drag & drop</span>
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#9a8a7a" }}>
            PNG, JPG, WEBP up to 10MB each
          </p>
        </div>
      </div>

      {/* Image Preview Grid */}
      {productData.productImg?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-1">
          {productData.productImg.map((file, idx) => {
            let preview;
            if (file instanceof File) preview = URL.createObjectURL(file);
            else if (typeof file === "string") preview = file;
            else if (file?.url) preview = file.url;
            else return null;

            return (
              <div key={idx} className="relative group rounded-xl overflow-hidden border"
                style={{ borderColor: "rgba(143,185,122,0.2)", background: "#faf7f2" }}>
                <img
                  src={preview}
                  alt="preview"
                  className="w-full aspect-square object-cover"
                />
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-150 opacity-0 group-hover:opacity-100"
                  style={{ background: "rgba(0,0,0,0.25)" }}
                />
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 active:scale-90 touch-manipulation"
                  style={{ background: "rgba(0,0,0,0.65)", color: "#fff" }}
                >
                  <X size={13} />
                </button>
                {/* Image index badge */}
                <div className="absolute bottom-1.5 left-1.5 text-xs px-1.5 py-0.5 rounded-md font-medium"
                  style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}>
                  {idx + 1}
                </div>
              </div>
            );
          })}

          {/* Add more tile */}
          <div
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-150 gap-1"
            style={{ borderColor: "rgba(143,185,122,0.3)", background: "rgba(143,185,122,0.02)" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.07)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(143,185,122,0.02)"}
          >
            <ImagePlus className="w-5 h-5" style={{ color: "#8fb97a" }} />
            <span className="text-xs font-medium" style={{ color: "#8fb97a" }}>Add more</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;