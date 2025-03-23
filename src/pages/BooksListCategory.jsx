import { useParams } from "react-router";
import { createAsyncGetBooks } from '../slice/BooksListSlice';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { RingLoader } from 'react-spinners';

const categoryMap = {
  daily: "日常生活",
  problemsolving: "解決問題",
  knowmyself: "認識自己",
  friends: "朋友相處",
  festival: "節慶團圓",
  tale: "傳說故事",
  earth: "愛護地球",
};

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function BooksListCategory () {
  // 取得URL中的分類網址
  const { category: routeCategory } = useParams();
  // 選取的類別，若為空陣列則顯示全部
  const selectedCategory = routeCategory || "全部繪本";
  
  const dispatch = useDispatch();
  const { booksList, status } = useSelector((state) => state.booksList);

  // 只有在第一次進入時才請求 API
  useEffect(() => {
    if (status === "idle") {
      dispatch(createAsyncGetBooks());
    }
  }, [dispatch, status]);

  // 根據分類過濾書籍
  const categorizedBooks =
  selectedCategory === "全部繪本"
    ? booksList
    : booksList.filter((book) => book.category === selectedCategory);

  // 跟在按鈕後面的loading，並設定為空物件
  const [ isLoading, setIsLoading ] = useState({});
  // 加入收藏的狀態變化
  const [ favorites, setFavorites ] = useState([]);
  // 加入購物車
  const addCartItem = async(product_id, qty) => {
    setIsLoading((prev) => ({
      ...prev,
      [product_id]: true,
    }));
    try {
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: {
          // 這裡不用寫product_id: product_id，直接寫以下的也是一樣意思
          product_id,
          qty: Number(qty)
        }
      })
      console.log(res)
    } catch (error) {
      alert(error.response?.data?.message || "加入購物車失敗")
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        [product_id]: false,
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


  return(<>
    <div>
      <h2 className="pt-5 pb-2">{categoryMap[selectedCategory]}</h2>
      <table className="d-md-table d-none table align-middle bg-primary-100 text-center table-hover">
        <thead>
          <tr className="table-primary-200">
            <th className="text-light" style={{fontSize: '20px'}}>圖片</th>
            <th className="text-light" style={{fontSize: '20px'}}>繪本名稱</th>
            <th className="text-light" style={{fontSize: '20px'}}>繪本描述</th>
            <th className="text-light d-xxl-table-cell d-none" style={{fontSize: '20px'}}>有無注音</th>
            <th className="text-light d-xxl-table-cell d-none" style={{fontSize: '20px'}}>線上免費借閱</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {status === "loading" ? (
            <p>載入中...</p>
          ) : 
            categorizedBooks.map((product) => {
              return(
                <tr key={product.id}>
                  <td style={{ width: "200px" }}>
                    <Link to={`/bookslist/detail/${product.id}`}>
                      <img
                        className="img-fluid"
                        src={product.imageUrl}
                        alt={product.title}
                      />
                    </Link> 
                  </td>
                  <td>
                    <Link to={`/bookslist/detail/${product.id}`} className="text-primary-300">{product.title}</Link>
                  </td>
                  <td>
                    <p style={{
                      maxWidth: '350px',
                      textAlign: 'left',
                      paddingLeft: '12px'
                    }}>{product.description}</p>
                  </td>
                  <td className="d-xxl-table-cell d-none">
                    {product.has_Zhuyin ? (<i className="bi bi-check-square"></i>) : (<i className="bi bi-x"></i>)}
                  </td>
                  <td className="d-xxl-table-cell d-none">
                    {product.canBorrowOnline ? (<i className="bi bi-check-square"></i>) : (<i className="bi bi-x"></i>)}
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm d-flex flex-column justify-content-center">
                      {/*加入收藏*/}
                      <button type="button"
                        onClick={() => handleFavorites(product.id)} 
                        className="btn btn-outline-secondary rounded">
                        {isFavorite(product.id) ? 
                          (<><i className="bi bi-heart-fill pe-1"></i><span>已收藏</span></>) : 
                          (<><i className="bi bi-bookmark-heart pe-1"></i><span>加入收藏</span></>)}
                      </button>
                      {/*加入購物車的按鈕預設就是+1，所以qty直接代入1*/}
                      {/*這裡不能只寫product_id，要代入是要電腦去抓什麼內容*/}
                      <button onClick={() => addCartItem(product.id, 1)} type="button" 
                        className="btn btn-outline-danger rounded d-flex justify-content-center align-items-center"
                        disabled={isLoading[product.id]}>
                        <i className="bi bi-backpack2 pe-1"></i>
                        {isLoading[product.id] ? (<RingLoader color="#000" size={15} />) : '加入書袋'} 
                      </button>
                    </div>
                  </td>
                </tr>
              )
            }   
          )}
        </tbody>
      </table>
      <div className="d-md-none d-block">
        {status === "loading" ? (
            <p>載入中...</p>
          ) : 
          categorizedBooks.map((product) => {
            return(
              <div className="row">
                <div className="col-12">
                  <div className="card d-flex flex-row align-items-center mb-3">
                    <Link to={`/bookslist/detail/${product.id}`} className="flex-shrink-0">
                      <img
                        src={product.imageUrl}
                        style={{objectFit: 'contain', maxWidth: '230px'}}
                        alt={product.title}
                      />
                    </Link> 
                    <div className="card-body">
                      <Link to={`/bookslist/detail/${product.id}`} className="text-primary-300 fs-sm-5 fs-3">{product.title}</Link>
                      <p className="card-text d-sm-block d-none">{product.description}</p>
                      <div className="btn-group btn-group-sm d-flex flex-sm-row flex-column justify-content-center">
                        {/*加入收藏*/}
                        <button type="button"
                          onClick={() => handleFavorites(product.id)} 
                          className="btn btn-outline-secondary rounded">
                          {isFavorite(product.id) ? 
                            (<><i className="bi bi-heart-fill pe-1"></i><span>已收藏</span></>) : 
                            (<><i className="bi bi-bookmark-heart pe-1"></i><span>加入收藏</span></>)}
                        </button>
                        {/*加入購物車的按鈕預設就是+1，所以qty直接代入1*/}
                        {/*這裡不能只寫product_id，要代入是要電腦去抓什麼內容*/}
                        <button onClick={() => addCartItem(product.id, 1)} type="button" 
                          className="btn btn-outline-danger rounded d-flex justify-content-center align-items-center"
                          disabled={isLoading[product.id]}>
                          <i className="bi bi-backpack2 pe-1"></i>
                          {isLoading[product.id] ? (<RingLoader color="#000" size={15} />) : '加入書袋'} 
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )  
          })
        }  
      </div>
    </div>
    
  </>)
}

export default BooksListCategory;