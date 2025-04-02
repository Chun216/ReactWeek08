import { useState, useEffect } from "react";
import axios from 'axios';
import Pagination from '../components/Pagination';
import ProductModal from '../components/ProductModal';
import DelProductModal from '../components/DelProductModal';
import Toast from '../components/Toast';
import { useNavigate } from "react-router";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""],
};

function ProductCatalog () {
  // axios取得資料後，狀態的改變
  const [products, setProducts] = useState([]);

  // 加入page參數是為了可以讓他按照頁碼跳不同的頁面
  const getProducts = async(page = 1) => {
    try {                                    // 寫入query，?之後是加入輸入的動作，前後不要加空格
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(res.data.products);
      // console.log(res.data.products); 用作確認內容
      // 頁面狀態改變時，要取得的資料
      setPageInfo(res.data.pagination);
      // console.log(res.data.pagination); 確認分頁資訊
    } catch (error) {
      alert(error.response?.data?.message || "無法取得產品資訊");
    }
  }

  useEffect(() => {
      getProducts();
  }, [])

  // 確認Modal是開還關，要不要用到ProductModal
  const [ isProductModalOpen, setIsProductModalOpen ] = useState(false)

  // 確認刪除Modal是否開關，要不要跳去delProductModal
  const [ isDelProductModalOpen, setIsDelProductModalOpen ] = useState(false)
  
  // 點擊按鈕開啟Modal的方法，再加入參數以確認是編輯還是新增
  const handleProductModalOpen = (mode, product) => {
    const imagesUrl = Array.isArray(product?.imagesUrl) ? product.imagesUrl : [product?.imagesUrl];
    setModalMode(mode);
    // 先判斷是新增還是編輯
    switch (mode) {
      case 'create':
        setTempProduct(defaultModalState);
        break;
      case 'edit':
        setTempProduct({
          ...product,
          imagesUrl
        });
        break;
      default:
        break;
    }
    setIsProductModalOpen(true);
  }

 
  // 點選後跳出Modal畫面，需要確認是編輯還是新增頁面
  const [ modalMode, setModalMode ] = useState(null);


  // 打開刪除Modal
  const handleDelProductModalOpen = (product) => {
    setTempProduct(product);
    setIsDelProductModalOpen(true);
  }
  


  // 把input對應到的方法與值加入
  // 輸入值，狀態才有所變化
  const [tempProduct, setTempProduct] = useState(defaultModalState);      

  // 點選不同頁面時，頁面狀態的改變
  const [pageInfo, setPageInfo] = useState({})

  // 點不同的頁面要跳去那頁
  const handlePageChange = (page) => {
    getProducts(page);
  }

  const navigate = useNavigate();
  
  // 登出
  const handleLogout = async() => {
    try {
      await axios.post(`${BASE_URL}/v2/logout`);
      // 清除 cookie
      document.cookie = "beeToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate('/adminlogin')
    } catch (error) {
      alert(error.response?.data?.message || "登出失敗");
    }
  }


  return(<>
    <div className="container">
      <div className="row my-3">
        <div className="justify-content-end">
          <button onClick={handleLogout} type="button" className="btn btn-secondary">
            登出
          </button>
        </div>
      </div>
      <div className="row">
            <div className="col">
              <div className="d-flex justify-content-between">
                <h2>產品列表</h2>
                <button onClick={() => handleProductModalOpen('create')} type="button" className="btn btn-primary">建立新的產品</button>
              </div>
              <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">產品名稱</th>
                      <th scope="col">原價</th>
                      <th scope="col">售價</th>
                      <th scope="col">是否啟用</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                      {products.map((item)=> {
                          return <tr key={item.id}>
                            <th scope="row">{item.title}</th>
                            <td>{item.origin_price}</td>
                            <td>{item.price}</td>
                            <td>{item.is_enabled ? (<span className="text-success">啟用</span>) : <span>未啟用</span> }</td>
                            <td>
                              <div className="btn-group">
                                <button onClick={() => handleProductModalOpen('edit', item)} type="button" className="btn btn-outline-primary btn-sm">編輯</button>
                                <button onClick={() => handleDelProductModalOpen(item)} type="button" className="btn btn-outline-danger btn-sm">刪除</button>
                              </div>
                            </td>
                          </tr>
                      })}
                  </tbody>
              </table>
            </div>
      </div>
      <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange}></Pagination>
    </div>
    {
      <ProductModal isOpen={isProductModalOpen} 
        setIsOpen={setIsProductModalOpen} 
        modalMode={modalMode} 
        tempProduct={tempProduct}
      getProducts={getProducts}></ProductModal>
    }
    {
      <DelProductModal isOpen={isDelProductModalOpen}
        setIsOpen={setIsDelProductModalOpen}
        tempProduct={tempProduct}
      getProducts={getProducts}></DelProductModal>
    }
    <Toast />
  </>)
}

export default ProductCatalog;