import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/nav'
import Home from './pages/home'
import {Toaster} from 'react-hot-toast'
import Footer from './components/footer';
import { useAppContext } from './context/Appcontext';
import Login from './components/login';
import AllProducts from './pages/Allproducts';
import ProductCategory from './pages/categoryproduct';
import ProductDetails from './pages/productDetails';
import Cart from './pages/cart';
import Address from './pages/adress';
import MyOrder from './pages/myorder';
import SellerLogin from './components/seller/sellerLogin';
import SellerUi from './pages/seller/sellerui';
import AddProductSeller from './pages/seller/addproduct';
import ProductList from './components/seller/productlist';
import Orders from './components/seller/orders';
import Loading from './components/seller/loading';

function App() {

  const isSellerPath = useLocation().pathname.includes('seller');
  const {showUserLogin, isSeller} = useAppContext();

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>

    {isSellerPath ? null :<Navbar/>}
    {showUserLogin ? <Login/> : null}

    <Toaster/>
    
    <div className={`${isSellerPath ? "" : 'px-6 md:px-16 lg:px-24 xl:px-32' }`}>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/products' element={<AllProducts/>}/>
        <Route path='/products/:category' element={<ProductCategory/>}/>
        <Route path='/products/:category/:id' element={<ProductDetails/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/add-address' element={<Address/>}/>
        <Route path='/my-orders' element={<MyOrder/>}/>
        <Route path='/loader' element={<Loading/>}/>
        <Route path='/seller' element={isSeller ? <SellerUi/> : <SellerLogin/>}>
        <Route index element={isSeller ? <AddProductSeller/> : null}/>
        <Route path='product-list' element={<ProductList/>}/>
        <Route path='orders' element={<Orders/>}/>
        </Route>
      </Routes>
    </div>
    {!isSellerPath && <Footer/>}
    </div>
  )
}

export default App
