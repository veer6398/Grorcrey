import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/Appcontext";
import ProductCart from "../components/productcart";


const AllProducts = () =>{

    const {products,searchQueary} = useAppContext();
    const [filteredProducts,setFilteredProducts] = useState([]);

    useEffect(()=>{
        if(searchQueary.length > 0){
            setFilteredProducts(products.filter(
                product => product.name.toLowerCase().includes(searchQueary.toLowerCase())
            ))
        }else{
            setFilteredProducts(products)
        }
    })

    return <div className=" mt-16 flex flex-col">
        <div className="flex flex-col items-end w-max">
            <p className="text-2xl font-medium uppercase">All products</p>
            <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
            {filteredProducts.filter((product)=> product.inStock).map((product, index)=>(
                <ProductCart key={index} product={product}/>
            ))}
        </div>
    </div>
};

export default AllProducts