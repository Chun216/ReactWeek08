import { useNavigate } from "react-router";
import { useState } from "react";
import ProductCatalog from "../pages/ProductCatalog";
import AdminLogin from "../pages/AdminLogin";

function AdminLayout () {
  const [isAuth, setIsAuth] = useState(false);

  return(
  <div className="admin-section">
    <div className="container">
      <h1>管理者頁面</h1>
      <ul className="list-unstyled">
        <li>
          {
            isAuth ? <ProductCatalog setIsAuth={setIsAuth} /> : <AdminLogin setIsAuth={setIsAuth} /> 
          }
        </li>
      </ul>
    </div>
  </div>)
}


export default AdminLayout;