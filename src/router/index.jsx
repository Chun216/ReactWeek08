import { createHashRouter } from "react-router";
import FrontLayout from "../layouts/FrontLayouts";
import AdminLayout from "../layouts/AdminLayout";
import Homepage from "../pages/Homepage";
import LoginPage from "../pages/LoginPage";
import NotFound from "../pages/NotFound";
import BooksList from "../pages/BooksList";
import BooksListHome from "../pages/BooksListHome";
import BooksListCategory from "../pages/BooksListCategory";
import BookDetail from "../pages/BookDetail";
import Checkout from "../pages/Checkout";
import Cart from "../pages/Cart";
import ProductCatalog from "../pages/ProductCatalog";
import AdminLogin from "../pages/AdminLogin";
import CouponCatalog from "../pages/CouponCatalog";



const routes = [
  {
    path: '/',
    element: <FrontLayout />,
    children: [
      {
        path: '',
        element: <Homepage />,
      },
      {
        path: '/bookslist',
        element: <BooksList />,
        children: [
          {
            path: '',
            element: <BooksListHome />,
          },
          {
            path: ':category',
            element: <BooksListCategory />,
          },
          {
            path: 'detail/:id',
            element: <BookDetail />,
          },
        ],
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: '/login',
        element: <LoginPage />
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'productcatalog',
        element: <ProductCatalog />
      },
      {
        path: 'couponcatalog',
        element: <CouponCatalog />
      }
    ]
  },
  {
    path: '/adminlogin',
    element: <AdminLogin />,
  },
  {
    path: '*',
    element: <NotFound />,
  }
]

const router = createHashRouter(routes);
export default router;