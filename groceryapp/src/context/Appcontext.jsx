import { createContext, useContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const Appcontext = createContext();

export const AppcontextProvider = ({children})=>{
    const navigate = useNavigate();
    const [user, setUser] = useState(true);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const currency = import.meta.env.VITE_CURRENCY;
    const [cartItems,setCartItems] = useState({});
    const [searchQueary,setSearchQueary] = useState({});

    //fetch seller status
    const fetchSeller = async ()=>{
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true)
            }else{setIsSeller(false)}
        } catch (error) {
            setIsSeller(false)
        }
    }

        //fetch user status and cart
        const fetchUser = async ()=>{
            try {
                const {data} = await axios.get('/api/user/is-auth');
                if(data.success){
                    setUser(data.user)
                    setCartItems(data.user.cartItems)
                }else{setUser(false)}
            } catch (error) {
                setUser(null)
            }
        }

    //add to cart
const addToCart = async (itemId)=>{
    let cartData = structuredClone(cartItems);

    if(cartData[itemId]){
        cartData[itemId] +=1;
    }else{
        cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success('Added to Cart');
}

//udate cart item quantity
const updateCartItem =(itemId, quantity)=>{
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success('Cart Updated');
}

//remove from cart
const removeFromCart =(itemId)=>{
    let cartData = structuredClone(cartItems);
    if(cartData[itemId]){
        cartData[itemId] -= 1;
        if(cartData[itemId]===0){
            delete cartData[itemId];
        }
    }
    toast.success('Removed from Cart');
    setCartItems(cartData);
}

//get cart items count
const cartCount = ()=> {
    let totalCount = 0;
    for(const item in cartItems){
        totalCount += cartItems[item];
    }
    return totalCount
}

// gat cart total
const cartTotal = () => {
    let totalAmount = 0;
    for (const items in cartItems){
        let itemInfo = products.find((product)=> product._id === items);
        if(cartItems[items] > 0){
            totalAmount += itemInfo.offerPrice * cartItems[items]
        }
    }
        return Math.floor(totalAmount*100)/100;
}


//fetch all products
    const fetchProducts = async ()=>{
        try {
            const {data} = await axios.get('/api/product/list')
            if(data.success){
                setProducts(data.products)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        fetchSeller()
        fetchProducts()
        fetchUser()
    },[])


    //updatecart database
    useEffect(()=>{
        const updateCart = async ()=>{
            try {
                const {data} = await axios.post('/api/cart/update', {cartItems})
                if(!data.success){
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }

        if(user){
            updateCart()
        }
    },[cartItems])

    const value = {navigate,user,setUser,isSeller,setIsSeller,showUserLogin,setShowUserLogin,products,currency,addToCart,updateCartItem,removeFromCart,cartItems,searchQueary,setSearchQueary,cartCount,cartTotal,axios,fetchProducts,setCartItems}

    return <Appcontext.Provider value={value}>
        {children}
    </Appcontext.Provider>
}

export const useAppContext = ()=>{
    return useContext(Appcontext)
}