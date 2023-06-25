import { useEffect} from 'react';
import { 
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import PrivateRoutes from './utils/PrivateRoutes';
import Home from "./scenes/home/Home";
import ItemDetails from './scenes/itemDetails/ItemDetails';
import Checkout from './scenes/checkout/Checkout';
import Confirmation from './scenes/checkout/Confirmation';
import Failure from './scenes/checkout/Failure';
import Navbar from './scenes/global/Navbar';
import CartMenu from './scenes/global/CartMenu';
import Footer from './scenes/global/Footer';
import Category from './scenes/category/Category';
import Profile from './scenes/profile/Profile';
import { AuthProvider } from './context/AuthContext';
import FavoritesMenu from './scenes/global/FavoritesMenu';
import UpdateProfile from './scenes/profile/UpdateProfile';
import Orders from './scenes/profile/Orders';
import Users from './scenes/profile/Users';
import Items from './scenes/profile/Items';
import ModifyItem from './scenes/profile/ModifyItem';
import ModifyPassword from './scenes/profile/ModifyPassword';
import Search from './scenes/search/Search';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname])

  return null
}


function App() {
  return (
    <div className="app">
      <AuthProvider>
        <BrowserRouter>
        <Navbar />
          <ScrollToTop />
            <Routes>   
                <Route path='/' element={<Home />} exact/>
                <Route path='item/:itemId' element={<ItemDetails />} />
                <Route path="category/:categoryId" element={<Category />} />
                <Route path="search/" element={<Search />} />
                <Route path="search/:query/" element={<Search />} />
                <Route element={<PrivateRoutes />}>
                  <Route path='profile' element={<Profile />} />
                  <Route path='profile/update-profile' element={<UpdateProfile />} />
                  <Route path='profile/modify-password' element={<ModifyPassword />} />
                  <Route path='profile/orders' element={<Orders />} />
                  <Route path='profile/users' element={<Users />} />
                  <Route path='profile/items' element={<Items />} />
                  <Route path='profile/items/modify-item/' element={<ModifyItem />} />
                  <Route path='profile/items/modify-item/:itemId' element={<ModifyItem />} />
                  <Route path='checkout' element={<Checkout />} />
                  <Route path='checkout/success' element={<Confirmation />} />
                  <Route path='checkout/failure' element={<Failure />} />
                </Route>
            </Routes>
          <CartMenu />
          <FavoritesMenu />
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
