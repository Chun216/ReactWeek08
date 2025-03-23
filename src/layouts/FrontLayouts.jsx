import { Outlet, NavLink, useLocation } from "react-router";
import logo from '../assets/logo.png';
import '../assets/FrontLayout.scss';
import { Link } from "react-router";

function FrontLayout () {
    const routes = [
      { path: "/", name: "首頁", icon: 'bi-house' },
      { path: "/bookslist", name: "📖繪本探險", icon: 'bi-book'},
      { path: "/cart", name: "🎒我的書袋", icon: 'bi-backpack2'},
      { path: "/login", name: "🔑探險準備", icon: 'bi-key'},
    ];

    const location = useLocation();

    return(<>
      <nav className="navbar border-body" data-bs-theme="dark" style={{backgroundColor:'#00000'}}>
        <div className="container">
          <ul className="navbar-nav flex-row gap-5 fs-5 d-md-flex align-items-center d-none">
            <NavLink to='' className='navbar-brand me-auto'>
              <img src={logo} className="logo" alt="筆筆書櫃標誌" />
            </NavLink>
            {/*不寫死內容，之後要加入可以調整上方routes內容就好*/}
            {
              routes.map((routes) => (
                <li key={routes.path} className="nav-item ">
                  <NavLink className="nav-link" 
                  style={{color:'#b44c0c',
                    backgroundColor: '#00000', 
                    fontWeight: location.pathname === routes.path ? 'bold' : 'normal'}} 
                  aria-current="page" to={routes.path}>{routes.name}</NavLink>
                </li>
              ))
            }
          </ul>
          <ul className="navbar-nav flex-row gap-4 fs-5 w-100 d-flex justify-content-between align-items-center d-md-none">
            <NavLink to='' className='navbar-brand me-auto'>
              <img src={logo} className="logo" alt="筆筆書櫃標誌" />
            </NavLink>
            {/*不寫死內容，之後要加入可以調整上方routes內容就好*/}
            {
              routes.map((routes) => (
                <li key={routes.path} className="nav-item ">
                  <NavLink to={routes.path} className="nav-link" 
                    style={{color:'#b44c0c', fontSize: '24px'}}><i className={`bi ${routes.icon}`}></i>
                  </NavLink>
                </li>
              ))
            }
            {/*漢堡選單*/}
            <button className="navbar-toggler btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" style={{fontSize: '24px'}}><i className="bi bi-list text-primary-200"></i></span>
            </button>
            <div className="offcanvas offcanvas-end bg-primary-200" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasNavbarLabel">筆筆書櫃</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>
              <div className="offcanvas-body">
                <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                  <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/">首頁</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/bookslist">全部繪本</Link>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      主題分類
                    </a>
                    <ul className="dropdown-menu bg-primary-300">
                      <li><Link className="dropdown-item" to='/bookslist/daily'>日常生活</Link></li>
                      <li><Link className="dropdown-item" to='/bookslist/problemsolving'>解決問題</Link></li>
                      <li><Link className="dropdown-item" to='/bookslist/knowmyself'>認識自己</Link></li>
                      <li><Link className="dropdown-item" to='/bookslist/friends'>朋友相處</Link></li>
                      <li><Link className="dropdown-item" to='/bookslist/festival'>節慶團圓</Link></li>
                      <li><Link className="dropdown-item" to='/bookslist/tale'>傳說故事</Link></li>
                      <li><Link className="dropdown-item" to='/bookslist/earth'>愛護地球</Link></li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/cart">我的書袋</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">探險準備</Link>
                  </li>
                </ul>
              </div>
            </div>          
          </ul>
        </div>
      </nav>
      <Outlet />
      <footer className="bg-primary-200 text-danger-100">
        <div className="container pt-5">
          <div className="row">
            {/* <!-- About Us Section --> */}
            <div className="col-md-3">
              <h6 className="text-danger-100">關於我們</h6>
              <span>我們是專注於提供優質繪本的電商平台，致力於讓每個家庭都能在閱讀中發現快樂。</span>
            </div>
            
            {/* <!-- Quick Links Section --> */}
            <div className="col-md-3 mt-md-0 mt-4">
              <h6 className="text-danger-100">快速連結</h6>
              <ul className="list-unstyled">
                <li><Link to="/" className="link-light">首頁</Link></li>
                <li><Link to="/bookslist/daily" className="link-light">繪本主題分類</Link></li>
                <li><a href="#" className="text-white">關於我們</a></li>
                <li><Link to="https://www.instagram.com/beemandarin_story/" className="link-light">聯絡我們</Link></li>
                <li><a href="#" className="text-white">隱私政策</a></li>
              </ul>
            </div>
      
            {/* <!-- Newsletter Section --> */}
            <div className="col-md-3 mt-md-0 mt-4">
              <h6 className="text-danger-100">訂閱電子報</h6>
              <form>
                <div className="input-group">
                  <input type="email" className="form-control" placeholder="輸入您的電子郵件" />
                  <button className="btn btn-danger-100" type="submit">訂閱</button>
                </div>
              </form>
            </div>
      
            {/* <!-- Contact Info Section --> */}
            <div className="col-md-3 mt-md-0 mt-4">
              <h6 className="text-danger-100">聯繫我們</h6>
              <ul className="list-unstyled">
                <li><i className="bi bi-telephone"></i> 電話：+886 123 456 789</li>
                <li><i className="bi bi-envelope"></i> 電子郵件：ya9870503@gmail.com</li>
                <li><i className="bi bi-geo-alt"></i> 地址：桃園市桃園區中山路</li>
                <Link to="https://www.instagram.com/beemandarin_story/"><i className="bi bi-instagram text-light"></i></Link>
                <Link to="https://www.linkedin.com/in/yachun-yang/" className="ps-2"><i className="bi bi-linkedin text-light"></i></Link>
              </ul>
            </div>
          </div>
      
          <div className="row mt-4">
            <div className="col text-center">
              <p>&copy; 2025 筆筆書櫃. 版權所有.</p>
            </div>
          </div>
        </div>
      </footer>
    </>)
}

export default FrontLayout