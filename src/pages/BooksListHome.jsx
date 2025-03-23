import { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import { Link } from "react-router";
import { RingLoader } from 'react-spinners';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function BooksListHome () {
  // 取得全部書單列表
  const [books, setBooks] = useState([]);
  // 搜尋繪本狀態
  const [search, setSearch] = useState('');
  // 是否有注音
  const [hasZhuyin, sethasZhuyin] = useState(false);
  // 是否可以免費借閱
  const [borrowOnline, setBorrowOnline] = useState(false);
  // 跟在按鈕後面的loading，並設定為空物件
  const [ isLoading, setIsLoading ] = useState({});
  // 加入收藏的狀態變化
  const [ favorites, setFavorites ] = useState([]);

  // 取得所有書單列表
  useEffect(() => {
    const getBooks = async () => {
      // setIsScreenLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
        setBooks(res.data.products);
        console.log(res);
      } catch (error) {
        alert(error.response?.data?.message || "取得產品失敗")
        console.log(error);
      } 
      // finally {
      //   setIsScreenLoading(false);
      // }
    };
    getBooks();
  }, []);

  // 搜尋後的篩選結果
  const filterBooks = useMemo(() => {
    return [...books]
      .filter((book) => book.title.match(search))
  }, [search, books])

  // 勾選，只顯示有注音
  const handleZhuyinCheckbox = (e) => {sethasZhuyin(e.target.checked)};
  // 勾選，只顯示可否線上免費借閱
  const handleBorrowOnlineCheckbox = (e) => {setBorrowOnline(e.target.checked)};
  // 篩選以上兩者
  const checkedFilterBooks = books.filter(book => {
    return (
      (hasZhuyin ? book.has_Zhuyin === 1 : true) &&
      (borrowOnline ? book.canBorrowOnline === 1 : true)
    );
  });

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
    {/*搜尋框*/}
    <div className="d-flex align-items-center">
        <label htmlFor="search" className="me-2"><i className="bi bi-search"></i></label>
        <input id="search" 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          placeholder="輸入繪本名稱"
          className="form-control mb-2"
        />
      </div>
      {/*是否有注音、是否可於台灣雲端書庫免費借閱*/}
      <div className="form-check">
        <div>
          <input
            type="checkbox"
            id="zhuyinCheckbox"
            className="form-check-input"
            checked={hasZhuyin}
            onChange={handleZhuyinCheckbox}
          />
          <label htmlFor="zhuyinCheckbox" className="form-check-label ms-1 mb-3">
            只顯示有注音的繪本
          </label>
        </div>
        <div>            
          <input
            type="checkbox"
            id="borrowOnlineCheckbox"
            className="form-check-input"
            checked={borrowOnline}
            onChange={handleBorrowOnlineCheckbox}
          />
          <label htmlFor="borrowOnlineCheckbox" className="form-check-label ms-1 mb-3">
            只顯示可以線上免費借閱的繪本
          </label>
        </div>
      </div>
      {/*是否進行搜尋，有filterBooks、無則books，搜尋後，有東西則顯示，無則顯示找不到*/}
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
          {
            (search ? filterBooks : checkedFilterBooks).length === 0 ? (
              <tr>
                <p colSpan="6" className="text-center">沒有找到符合條件的繪本</p>
              </tr>
            ) : (
              (search ? filterBooks : checkedFilterBooks).map((product) => {
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
              })
            )
          }
        </tbody>
      </table>
      {/*RWD的尺寸md以下版型*/}
      <div className="d-md-none d-block">
        {
          (search ? filterBooks : checkedFilterBooks).length === 0 ? (
            <tr>
              <p colSpan="6" className="text-center">沒有找到符合條件的繪本</p>
            </tr>
          ) : (
            (search ? filterBooks : checkedFilterBooks).map((product) => {
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
          )
        }
      </div>
  </>)
}

export default BooksListHome;