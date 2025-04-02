import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, } from "react-router";
import { RingLoader } from 'react-spinners';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const categoryMap = {
  daily: "日常生活",
  problemsolving: "解決問題",
  knowmyself: "認識自己",
  friends: "朋友相處",
  festival: "節慶團圓",
  tale: "傳說故事",
  earth: "愛護地球",
};

function BookDetail () {
  const [product, setProduct] = useState({});
  const [qtySelect, setQtySelect] = useState(1);
  // 跟在按鈕後面的loading，要分開來寫，不然會同時作用
  const [ isLoading, setIsLoading ] = useState({addToCart: false, buyNow: false});
  // 加入收藏的狀態變化
  const [ favorites, setFavorites ] = useState([]);  
  // id可以藉由useParams取得
  const { id } = useParams();
  useEffect(() => {
    const getProductDetail = async () =>{
      try {
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/product/${id}`)
        setProduct(res.data.product)
      } catch (error) {
        alert(error.response?.data?.message || "查看更多失敗")
      }
    };
    getProductDetail();      
  }, [id])
  
// 加入購物車
const addCartItem = async(product_id, qty) => {
  setIsLoading((prev) => ({
    ...prev,
    addToCart: true
  }));
  try {
    await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
      data: {
        // 這裡不用寫product_id: product_id，直接寫以下的也是一樣意思
        product_id,
        qty: Number(qty)
      }
    })
    // 因為還沒渲染到頁面上，可以先以這個確認
    // console.log(res);
  } catch (error) {
    alert(error.response?.data?.message || "加入購物車失敗")
  } finally {
    setIsLoading((prev) => ({
      ...prev,
      addToCart: false
    }));
  }
}

// 加入、移除收藏
const handleFavorites = ((product_id) => {
  setFavorites((prev) => prev.includes(product_id) ? 
  prev.filter((id) => id !== product_id) :  // 移除收藏
  [...prev, product_id])  //加入收藏
})
// 確認是否為收藏
const isFavorite = ((product_id) => favorites.includes(product_id));

// 在產品詳情頁面直接購買並跳轉至購物車與結帳頁
const navigate = useNavigate();

const handleBuyNow = async(product_id, qty) => {
  setIsLoading((prev) => ({
    ...prev,
    buyNow: true
  }));
  try {
    await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
      data: {
        product_id,
        qty: Number(qty)
      }
    })
    navigate('/cart');
  } catch (error) {
    alert(error.response?.data?.message || "直接購買失敗")
  } finally {
    setIsLoading((prev) => ({
      ...prev,
      buyNow: false
    }));
  }
};

  

  return(<>
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-6">
          <img className="img-fluid" src={product.imageUrl} alt={product.title} />
        </div>
        <div className="col-lg-6 mt-lg-0 mt-3">
          <div className="d-flex align-items-center gap-2">
            <h2>{product.title}</h2>
            <span className="badge text-bg-success">{categoryMap[product.category]}</span>
          </div>
          <div className="d-flex align-items-center mt-2">
            <p className="me-4">
              <span className="me-2">是否可於線上借閱</span>
              {product.canBorrowOnline ? (<i className="bi bi-check-square"></i>) : (<i className="bi bi-x"></i>)}
            </p>
            <p>
              <span className="me-2">是否有注音</span>
              {product.has_Zhuyin ? (<i className="bi bi-check-square"></i>) : (<i className="bi bi-x"></i>)}
            </p>
          </div>         
          <p className="mb-3">{product.description}</p>
          <p className="mb-3">{product.content}</p>
          <del>NT$ {product.origin_price}</del>
          <h5 className="mb-3">NT$ {product.price}</h5>
          <div className="input-group align-items-center w-75">
            <select
              value={qtySelect}
              onChange={(e) => setQtySelect(e.target.value)}
              id="qtySelect"
              className="form-select"
            >
              {Array.from({ length: 10 }).map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
            {/*加入書袋，記得加入點選後所要進行的事件*/}
            <button
              onClick={(() => addCartItem(product.id, Number(qtySelect)))} 
              type="button" 
              className="btn btn-primary-200 d-flex align-items-center text-light"
              disabled={isLoading.addToCart}><i className="bi bi-backpack2 pe-1"></i>
              {isLoading.addToCart ? (<RingLoader color="#000" size={15} />) : '加入書袋'}
            </button>
          </div>
          <div className="pt-4">
            {/*加入收藏*/}
            <button type="button"
              onClick={() => handleFavorites(product.id)} 
              className="btn btn-outline-secondary rounded me-3">
              {isFavorite(product.id) ? 
                (<><i className="bi bi-heart-fill pe-1"></i><span>已收藏</span></>) : 
                (<><i className="bi bi-bookmark-heart pe-1"></i><span>加入收藏</span></>)}
            </button>
            <button type="button"
              className="btn btn-outline-danger rounded"
              onClick={() => handleBuyNow(product.id, 1)}
              disabled={isLoading.buyNow}
              ><i class="bi bi-bag-check-fill pe-1"></i>
              {isLoading.buyNow ? (<RingLoader color="#000" size={15} />) : '直接購買'}
            </button>
          </div>
        </div>
      </div>
    </div>
  </>)
}

export default BookDetail;