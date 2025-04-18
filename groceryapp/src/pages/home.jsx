import React from "react";
import Hero from "../components/hero";
import Categories from "../components/category";
import BestSeller from "../components/bestseller";
import BottomBanner from "../components/bottembanner";
import NewsLetter from "../components/newsletter";

const Home = ()=>{
    return<div className="mt-10">
        <Hero/>
        <Categories/>
        <BestSeller/>
        <BottomBanner/>
        <NewsLetter/>
    </div>
}

export default Home