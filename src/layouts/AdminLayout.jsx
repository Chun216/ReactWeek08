import { Outlet, Link, useNavigate } from "react-router";

function AdminLayout () {

  const navigate = useNavigate();
   
  return(
  <div className="admin-section">
    <div className="container pt-5">
      <h1>管理者頁面</h1>
      <ul className="list-unstyled d-flex align-items-center">
        <li>
          <Link to="/adminlogin" className="text-primary-300">管理者登入頁面</Link>
        </li>
        <li>
          <Link to="/admin/productcatalog" className="ms-3 text-primary-300">產品列表管理</Link>
        </li>
        <li>
          <Link to="/admin/couponcatalog" className="ms-3 text-primary-300">優惠券管理</Link>
        </li>
        <li>
          <button type="button" 
            className="btn btn-sm btn-danger-100 text-light ms-3"
            onClick={() => navigate('/')}
            >回前台</button>
        </li>
      </ul>
      <Outlet />
    </div>
  </div>)
}


export default AdminLayout;