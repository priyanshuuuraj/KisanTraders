import React from "react";
import ProductImg from "@/components/ProductImg";
import ProductDesc from "@/components/ProductDesc";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SingleProduct = () => {

  const params = useParams();
  const productId = params.id;

  const { products } = useSelector((store) => store.product);

  const product = products.find((item) => item._id === productId);

  if (!product) {
    return <div className="pt-20 text-center">Product not found</div>;
  }

  return (
    <div className="pt-35 max-w-7xl mx-auto px-4">
  <Breadcrumbs product={product} />

      <div className="mt-10 grid grid-cols-2 items-start gap-10">

        <ProductImg images={product.productImg} />

        <ProductDesc product={product} />

      </div>

    </div>
  );
};

export default SingleProduct;