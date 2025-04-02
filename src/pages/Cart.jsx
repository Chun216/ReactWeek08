import { useState, useEffect } from 'react';
import axios from 'axios';
import { RingLoader } from 'react-spinners';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart () {
  // 購物車狀態
  const [cart, setCart] = useState({});
  // 跟在按鈕後面的loading，因為同一頁有多個所以必須要分別出來
  const [ isDelLoading, setIsDelLoading ] = useState({});
  // 全螢幕的loading
  const [ isScreenLoading, setIsScreenLoading ] = useState(false);

  // axios取得購物車產品列表
  const getCartProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      console.log(res);
      setCart(res.data.data);
    } catch (error) {
      // 錯誤提示中不一定有response或data，可以依照下列的模式都寫出來
      alert(error.response?.data?.message || "取得購物車商品失敗")
    }
  }

  // 呼叫取得購物車列表
  useEffect(() => {
    getCartProducts();
  }, [])

  // 取得axios清空購物車
  const removeCart = async() => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      // 清空後要更新購物車列表
      getCartProducts();
    } catch (error) {
      alert(error.response?.data?.message || "清空購物車商品失敗")
    } finally {
      setIsScreenLoading(false);
    }
  }

  // 取得axios清除購物車單一品項
  const removeCartItem = async (cartItem_id) => {
    setIsDelLoading((prev) => ({
      ...prev,
      [cartItem_id]: true,
    }));
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`)
      // 在尚未渲染前可以用這個來確認
      // console.log(res);
      getCartProducts();
    } catch (error) {
      alert(error.response?.data?.message || "清除購物車單一商品失敗")
    } finally {
      setIsDelLoading((prev) => ({
        ...prev,
        [cartItem_id]: false,
      }));
    }
  }

  // 取得axios調整購物車產品數量
  const updateCartItem = async (cartItem_id, product_id, qty) => {
    setIsScreenLoading(true);
    try {
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`, {
        data: {
          product_id,
          qty: Number(qty),
        }
      })
      getCartProducts();
    } catch (error) {
      alert(error.response?.data?.message || "調整購物車單一商品數量失敗")
    } finally {
      setIsScreenLoading(false);
    }
  }

  // 套用優惠券
  // const couponCode = "READWITHKIDS20";

  const [couponCode, setCouponCode] = useState(""); // 優惠碼
  const [coupon, setCoupon] = useState(null); // API 回應的優惠資訊

  const applyCoupon = async() => {
    try {
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/coupon`, {
        data: {
          code: couponCode,
        }
      })
      setCoupon(res.data.data.final_total)
      console.log(res.data.data)
      setCouponCode('')
    } catch (error) {
      alert(error.response?.data?.message || "優惠券使用失敗")
    }
  }

  const [deliveryMethod, setDeliveryMethod] = useState('store');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [store, setStore] = useState('7-11');

  // 處理表單內容
  const {  
    register, 
    handleSubmit, 
    formState: { errors },  
    reset
  } = useForm();

  // 使用方法
  const onSubmit = handleSubmit((data) => {
    // 尚未加入結帳API時可以先用這個來確認內容與驗證表單
    // console.log(data);
    // 從data把內容解構出來
    const { message, ...user } = data;
    const userInfo = {
      data: {
        message,
        user
      }
    }
    checkout(userInfo);
  })

  // 取得axios，結帳API
  const checkout = async(data) => {
    setIsScreenLoading(true);
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, data);
      reset();
      // 送出成功後跳轉至結帳成功頁面
      navigate('/checkout');
      // removeCart();
      // getCartProducts(); 
    } catch (error) {
      alert(error.response?.data?.message || "結帳失敗")
    } finally {
      setIsScreenLoading(false);
    }
  }

  const navigate = useNavigate();

  return(<>
    {/*當購物車清空時，按鈕都會一併消失*/}
    <div className="cart-section bg-primary-100">
      <div className='container'>
        <div>
          <div className="row">
            {
              cart.carts?.length > 0 && (
              <div className="col-12">
                <div className="pt-5 pb-3 d-flex justify-content-between">
                  <h2>我的書袋</h2>
                  <button onClick={removeCart} className="btn btn-outline-danger" type="button">
                    清空書袋
                  </button>
                </div>
                <table className="table align-middle table-hover d-none d-sm-table">
                  <thead>
                    <tr className='text-center table-primary-200'>
                      <th className='text-light'>品名</th>
                      <th className='text-light'>數量/單位</th>
                      <th className="text-end text-light">金額</th>
                      <th></th>
                    </tr>
                  </thead>         
                  <tbody>
                    {/*加入可選串聯是因為carts是後續生成的內容為了防止錯誤*/}
                    {
                      cart.carts?.map((cartItem) => {
                        return (<>
                          <tr key={cartItem.id}>
                            <td className='d-flex justify-content-start align-items-center'>
                              <img src={cartItem.product.imageUrl} alt={cartItem.product.title}
                              style={{maxWidth: '150px'}} />
                              <span className='ms-3'>{cartItem.product.title}</span>
                            </td>
                            <td style={{ width: "150px" }}>
                              <div className="d-flex align-items-center">
                                <div className="btn-group me-2" role="group">
                                  <button
                                    onClick={() => updateCartItem(cartItem.id, cartItem.product_id, cartItem.qty - 1)}
                                    disabled={cartItem.qty === 1}
                                    type="button"
                                    className="btn btn-outline-dark btn-sm"
                                  >
                                    -
                                  </button>
                                  <span
                                    className="btn border border-dark"
                                    style={{ width: "50px", cursor: "auto" }}
                                  >{cartItem.qty}</span>
                                  <button
                                    onClick={() => updateCartItem(cartItem.id, cartItem.product_id, cartItem.qty + 1)}
                                    type="button"
                                    className="btn btn-outline-dark btn-sm"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className="input-group-text bg-transparent border-0">
                                  {cartItem.product.unit}
                                </span>
                              </div>
                            </td>
                            <td className="text-end">{cartItem.total}</td>
                            <td className='text-center'>
                              <button onClick={() => removeCartItem(cartItem.id)} 
                                type="button" 
                                className="btn btn-outline-danger btn-sm">
                                <i className="bi bi-trash pe-1"></i>
                                {isDelLoading[cartItem.id] ? (<RingLoader color="#000" size={15} />) : ''} 
                              </button>
                            </td>
                          </tr>
                        </>)
                      })
                    }  
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end fs-4">
                        總計：
                      </td>
                      <td className="text-end fs-4" style={{ width: "130px" }}>NT${cart.total}</td>
                    </tr>
                    {
                    coupon !== null && (
                    <tr>
                      <td colSpan="3" className="text-end fs-4">
                        折扣後總計：
                      </td>
                      <td className='text-end text-danger fs-4'
                        style={{width: '130px', fontWeight: 'bold'}}>
                        NT${coupon}
                      </td>
                    </tr>)
                    }  
                  </tfoot>
                </table>
                
                {/*RWD的購物車*/}
                {
                  cart.carts?.map((cartItem) => {
                    return(<>
                      <div className='d-sm-none d-flex mt-3' key={cartItem.id}>
                        <div className='d-flex'>
                          <img src={cartItem.product.imageUrl} alt={cartItem.product.title} 
                          style={{maxWidth: '150px'}} />
                        </div>
                        <div className='ms-2 d-flex flex-column justify-content-between'>
                          <div className='d-flex'>
                            <span className='me-1'>數量/單位</span>
                            <div className="d-flex align-items-center">
                              <div className="btn-group me-1" role="group">
                                <button
                                  onClick={() => updateCartItem(cartItem.id, cartItem.product_id, cartItem.qty - 1)}
                                  disabled={cartItem.qty === 1}
                                  type="button"
                                  className="btn btn-outline-dark btn-sm"
                                >
                                  -
                                </button>
                                <span
                                  className="btn border border-dark"
                                  style={{ width: "30px", cursor: "auto" }}
                                >{cartItem.qty}</span>
                                <button
                                  onClick={() => updateCartItem(cartItem.id, cartItem.product_id, cartItem.qty + 1)}
                                  type="button"
                                  className="btn btn-outline-dark btn-sm"
                                >
                                  +
                                </button>
                              </div>
                              <span className="input-group-text bg-transparent border-0">
                                {cartItem.product.unit}
                              </span>
                            </div>
                          </div>
                          <div className='d-flex'>
                            <span>金額</span>
                            <span className='ms-2'>{cartItem.total}</span>
                          </div>                        
                          <button onClick={() => removeCartItem(cartItem.id)} 
                            type="button" 
                            className="btn btn-outline-danger btn-sm">
                            <i className="bi bi-trash pe-1"></i>
                            {isDelLoading[cartItem.id] ? (<RingLoader color="#000" size={15} />) : ''} 
                          </button>
                        </div> 
                      </div>
                    </>)
                  })
                }  
              </div>)
            }
            <div className='d-sm-none d-block mt-3 text-end'>
              <h4>總計：NT${cart.total}</h4>
              {
                coupon !== null && (<h4 className='text-danger' style={{fontWeight: 'bold'}}>折扣後總計：NT${coupon}</h4>)
              }
            </div>
            <div className="my-4">
              <div className='d-flex align-items-lg-center flex-lg-row flex-column bg-primary-100'>
                <label className="form-label fw-bold">🎟️ 使用優惠碼</label>
                <div className="input-group w-auto ps-lg-3 ps-0">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="請輸入優惠碼"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button className="btn btn-danger-100 text-light" onClick={applyCoupon}>
                    套用
                  </button>
                </div>
              </div>
            </div> 
            <form onSubmit={onSubmit}>
              <div className="col-12 pt-5">
                <h3>配送資訊</h3>
                <div className="mt-4">
                  <label className="d-flex align-items-center">
                    <input
                      type="radio"
                      value="store"
                      checked={deliveryMethod === 'store'}
                      onChange={() => setDeliveryMethod('store')}
                      className="form-radio me-2"
                    />
                    <span className="ml-2">超商取貨</span>
                  </label>
                  
                  {deliveryMethod === 'store' && (
                    <div className="mt-4">
                      <div className='d-flex justify-content-between'>
                        <label htmlFor="email" className="form-label" style={{ flex: '0 0 auto' }}>Email</label>
                        <input
                          {...register('email',{
                            required: 'email欄位必填',
                            pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                              message: 'Email格式錯誤',
                            }
                          })}
                          className={`form-control border rounded mb-2 ms-2 ${errors.email && 'is-invalid'}`}
                          id="email" 
                          placeholder="輸入email" />
                        {errors.email && <p className="text-danger my-2">{errors.email.message}</p>}
                      </div>
                      <div className='d-flex justify-content-between'>
                        <label htmlFor="name" className="form-label" style={{ flex: '0 0 auto' }}>收件人姓名</label>
                        <input
                          {...register('name', {
                            required: '收件人姓名必填',
                          })} 
                          className={`form-control border rounded mb-2 ms-2 ${errors.name && 'is-invalid'}`}
                          id="name" 
                          placeholder="輸入收件人姓名" />
                        {errors.name && <p className="text-danger my-2">{errors.name.message}</p>}
                      </div>
                      <div className='d-flex justify-content-between'>
                        <label htmlFor="address" className="form-label" style={{ flex: '0 0 auto' }}>收件人電話</label>
                        <input
                          {...register('tel', {
                           required: '電話為必填',
                           pattern: {
                             value: /^(0[2-8]\d{7}|09\d{8})$/,
                             message: '電話格式錯誤',
                           }
                          })}
                          className={`form-control border rounded mb-2 ms-2 ${errors.tel && 'is-invalid'}`} 
                          id="address" 
                          placeholder="輸入電話" />
                        {errors.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
                      </div>
                      <div className='d-flex justify-content-between'>
                        <label>超商</label>
                        <select
                          value={store}
                          onChange={(e) => setStore(e.target.value)}
                          className="w-full p-2 border rounded mb-2"
                        >
                          <option value="7-11">7-11 超商</option>
                          <option value="familyMart">全家便利商店</option>
                        </select>
                      </div>                      
                      <div className='d-flex justify-content-between'>
                        <label htmlFor="store" className="form-label" style={{ flex: '0 0 auto' }}>超商門市</label>
                        <input
                          {...register('store', {
                            required: '超商門市為必填',
                           })} 
                           className={`form-control border rounded mb-2 ms-2 ${errors.store && 'is-invalid'}`}  
                          id="store" 
                          placeholder="輸入門市" />
                        {errors.store && <p className="text-danger my-2">{errors.store.message}</p>}
                      </div>
                    </div>
                       
                    )}
                    <label className="inline-flex items-center mt-5">
                        <input
                          type="radio"
                          value="home"
                          checked={deliveryMethod === 'home'}
                          onChange={() => setDeliveryMethod('home')}
                          className="form-radio text-brown-500"
                        />
                        <span className="ms-2">宅配到府</span>
                      </label>
                    {
                      deliveryMethod === 'home' && (
                      <div className="mt-4">
                        <div className='d-flex justify-content-between'>
                          <label htmlFor="email" className="form-label" style={{ flex: '0 0 auto' }}>Email</label>
                          <input
                            {...register('email',{
                              required: 'email欄位必填',
                              pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: 'Email格式錯誤',
                              }
                            })}
                            className={`form-control border rounded mb-2 ms-2 ${errors.email && 'is-invalid'}`}
                            id="email" 
                            placeholder="輸入email" />
                          {errors.email && <p className="text-danger my-2">{errors.email.message}</p>}
                        </div>
                        <div className='d-flex justify-content-between'>
                          <label htmlFor="name" className="form-label" style={{ flex: '0 0 auto' }}>收件人姓名</label>
                          <input
                            {...register('name', {
                              required: '收件人姓名必填',
                            })} 
                            className={`form-control border rounded mb-2 ms-2 ${errors.name && 'is-invalid'}`}
                            id="name" 
                            placeholder="輸入收件人姓名" />
                          {errors.name && <p className="text-danger my-2">{errors.name.message}</p>}                         
                        </div>
                        <div className='d-flex justify-content-between'>
                          <label htmlFor="address" className="form-label" style={{ flex: '0 0 auto' }}>收件人電話</label>
                          <input
                            {...register('tel', {
                             required: '電話為必填',
                             pattern: {
                               value: /^(0[2-8]\d{7}|09\d{8})$/,
                               message: '電話格式錯誤',
                             }
                            })}
                            className={`form-control border rounded mb-2 ms-2 ${errors.tel && 'is-invalid'}`} 
                            id="address" 
                            placeholder="輸入電話" />
                          {errors.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
                        </div>
                        <div className='d-flex justify-content-between'>
                          <label htmlFor="address" className="form-label" style={{ flex: '0 0 auto' }}>地址</label>
                          <input
                            {...register('address', {
                             required: '地址為必填',
                            })}
                            className={`form-control border rounded mb-2 ms-2 ${errors.address && 'is-invalid'}`} 
                            id="address" 
                            placeholder="輸入地址" />
                          {errors.address && <p className="text-danger my-2">{errors.address.message}</p>}
                        </div>
                      </div>)
                    }  
                  <hr className='mt-5' />
                  {/* 付款方式 */}
                  <h3 className="mt-5">付款方式</h3>
                  <div className="mt-4 d-flex flex-column">
                    {['cod', 'pay', 'atm'].map((method) => (
                      <label className="block mb-2" key={method}>
                        <input
                          type="radio"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                          className="form-radio me-2"
                        />
                        <span className="ml-2">{method === 'cod' ? '貨到付款' : method === 'pay' ? 'LinePay' : 'ATM 轉帳'}</span>
                      </label>
                    ))}
                  </div>
            
                  {/* 按鈕 */}
                  <button
                    type='submit' 
                    className="w-full p-2 mt-3 mb-5 btn btn-primary-200 text-white rounded">
                    訂單確認，前往付款
                  </button>
                </div>
              </div>
            </form>        
          </div>
        </div>
      </div>
    </div>
    {
      isScreenLoading && (
        <div 
          style={{
            position: 'fixed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            zIndex: 100,
        }}
        >
            <RingLoader color="#000" height={60} width={60} />
        </div>
      )
    }
  </>)
}

export default Cart;