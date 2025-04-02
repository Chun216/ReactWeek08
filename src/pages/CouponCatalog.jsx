import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useDispatch } from "react-redux";
import { pushMessage } from '../slice/ToastSlice';
import Toast from "../components/Toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

// 彈出表格初始狀態
const defaultCouponModalState = {
  title: "",
  percent: "",
  due_date: "",
  code: "",
  is_enabled: false
};

function CouponCatalog () {
  // 取得優惠券狀態
  const [coupons, setCoupons] = useState([]);

  // 彈出視窗的暫存表單
  const [tempCoupon, setTempCoupon] = useState(defaultCouponModalState);
  // modal確認是新增或編輯狀態
  const [couponModalMode, setCouponModalMode] = useState(null);
  // 視窗是否開啟
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  // 刪除優惠券modal是否開啟
  const [ isDelCouponModalOpen, setIsDelCouponModalOpen ] = useState(false);
  // 視窗的資料狀態
  const [couponModalData, setCouponModalData] = useState(tempCoupon);

  //useRef綁定DOM元素
  const couponModalRef = useRef(null);
  const delCouponModalRef = useRef(null);

  const dispatch = useDispatch();

  // 監聽tempCoupon，當有變更時，也更新modal內資料
  useEffect(() => {
      setCouponModalData({
          ...tempCoupon,
      })
  }, [tempCoupon])

  // 初始化bootstrap Modal+不允許點擊背景關閉
  useEffect(() => {
    if (couponModalRef.current) {
      const couponModal = Modal.getOrCreateInstance(couponModalRef.current, {
        backdrop: false, // 設定不允許點擊背景關閉
      });
  
      if (isCouponModalOpen) {
        couponModal.show();
      } else {
        couponModal.hide();
      }
    }
  
    if (delCouponModalRef.current) {
      const delCouponModal = Modal.getOrCreateInstance(delCouponModalRef.current, {
        backdrop: false,
      });
  
      if (isDelCouponModalOpen) {
        delCouponModal.show();
      } else {
        delCouponModal.hide();
      }
    }
  }, [isCouponModalOpen, isDelCouponModalOpen]);

  // 點擊按鈕開啟Modal的方法，再加入參數以確認是編輯還是新增
  const handleCouponModalOpen = (mode, coupon) => {
    setCouponModalMode(mode);
    // 先判斷是新增還是編輯
    switch (mode) {
      case 'create':
        setTempCoupon(defaultCouponModalState);
        break;
      case 'edit':
        setTempCoupon({
          ...coupon,
        });
        break;
      default:
        break;
    }
    setIsCouponModalOpen(true);
  }

  // 點擊叉叉或取消關閉Modal的方法
  const handleCouponModalClose = () => {
    const modalInstance = Modal.getInstance(couponModalRef.current);
    modalInstance.hide();
    setIsCouponModalOpen(false);
  }
  
  // Modal框框內容輸入改變的方法
  const handleCouponModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    // 有的是輸入值、有的是勾選checkbox
    setCouponModalData({
      ...couponModalData,
      [name]: type === 'checkbox' ? checked : value
    })
  }


  // 打開刪除Modal
  const handleDelCouponModalOpen = (coupon) => {
    setTempCoupon(coupon);
    setIsDelCouponModalOpen(true);
  }
  // 刪除優惠券的API
  const delCoupon = async () => {
    try {
      // 呼叫的API連結與要代入的資料
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/coupon/${tempCoupon.id}`)
    } catch (error) {
      const { message } = error.response.data;
      dispatch(pushMessage({
        text: message.join('、'),
        status: 'failed'
      }))
    }
  }
  // 刪除Modal視窗關閉
  const handleDelCouponModalClose = () => {
    const delCouponModalInstance = Modal.getInstance(delCouponModalRef.current);
    delCouponModalInstance.hide();
    setIsDelCouponModalOpen(false);
  }
  // 刪除優惠券的方法
  const handleDelCoupon = async() => {
    try {
      await delCoupon();
      getAllCoupons();
      handleDelCouponModalClose();
      dispatch(pushMessage({
        text: '刪除優惠券成功',
        status: 'success'
      }))
    } catch (error) {
      const { message } = error.response.data;
      dispatch(pushMessage({
        text: message.join('、'),
        status: 'failed'
      }))
    }
  }
  // 新增優惠券
  const createCoupon = async () => {
    try {
      const dueDateTimestamp = new Date(couponModalData.due_date).getTime() / 1000;
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/coupon`, {
        data: {
          ...couponModalData,
          is_enabled: couponModalData.is_enabled ? 1 : 0,
          percent: Number(couponModalData.percent),
          due_date: dueDateTimestamp,
        }
      })
      dispatch(pushMessage({
        text: '新增優惠券成功',
        status: 'success'
      }))
      getAllCoupons();
    } catch (error) {
      const { message } = error.response.data;
      dispatch(pushMessage({
        text: message.join('、'),
        status: 'failed'
      }))
    }
  }
  // 編輯優惠券
  const updateCoupon = async () => {
    try {
      const dueDateTimestamp = new Date(couponModalData.due_date).getTime() / 1000;
      const res = await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/coupon/${couponModalData.id}`, {
        data: {
          ...couponModalData,
          is_enabled: couponModalData.is_enabled ? 1 : 0,
          percent: Number(couponModalData.percent),
          due_date: dueDateTimestamp,
        }
      })
      dispatch(pushMessage({
        text: '編輯優惠券成功',
        status: 'success'
      }))
      console.log(res.data.data)
      console.log(couponModalData.due_date)
    } catch (error) {
      const { message } = error.response.data;
      dispatch(pushMessage({
        text: message.join('、'),
        status: 'failed'
      }))
    }
  }
  // 先確認要新增還是編輯
  const handleUpdateCoupon = async() => {
    const apiCouponCall = couponModalMode === 'create' ? createCoupon : updateCoupon
    try {
      await apiCouponCall();
      getAllCoupons();
      handleCouponModalClose();
    } catch (error) {
      const { message } = error.response.data;
      dispatch(pushMessage({
        text: message.join('、'),
        status: 'failed'
      }))
    }
  }
  // 取得全部優惠券
  const getAllCoupons = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/coupons?page=1`)
      setCoupons(res.data.coupons);
    } catch (error) {
      alert(error.response?.data?.message || "取得優惠券失敗")
    }
  }
  useEffect(() => {
   getAllCoupons()
  }, [])
  return(<>
    <h1>優惠券管理</h1>
    <button className="btn btn-success" onClick={() => handleCouponModalOpen('create')}>
      新增優惠券
    </button>
    {/* 優惠券列表 */}
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>優惠券名稱</th>
            <th>折扣%</th>
            <th>優惠碼</th>
            <th>有效期限</th>
            <th>狀態</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td>{coupon.title}</td>
                <td>{coupon.percent}%</td>
                <td>
                  <span className="badge bg-success">{coupon.code}</span>
                </td>
                <td>{new Date(coupon.due_date * 1000).toLocaleDateString()}</td>
                <td>{coupon.is_enabled ? "✅ 啟用" : "❌ 停用"}</td>
                <td>
                  <div className="btn-group">
                    <button type="button" 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleCouponModalOpen('edit', coupon)}
                      >編輯
                    </button>
                    <button type="button" 
                      className="btn btn-outline-danger btn-sm"
                      onClick={()=>handleDelCouponModalOpen(coupon)}
                      >刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                沒有優惠券
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/*優惠券Modal*/}
    {
      <div ref={couponModalRef} className="modal fade" tabIndex="-1" aria-hidden="true" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fs-4">{couponModalMode === 'create' ? '新增優惠券' : '編輯優惠券'}</h5>
            <button onClick={handleCouponModalClose} type="button" className="btn-close" aria-label="Close"></button>
          </div>
          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    優惠券名稱
                  </label>
                  <input
                    value={couponModalData.title}
                    onChange={handleCouponModalInputChange}
                    name="title"
                    id="title"
                    type="text"
                    className="form-control"
                    placeholder="請輸入標題"
                  />
                </div>
    
                <div className="mb-3">
                  <label htmlFor="percent" className="form-label">
                    折扣
                  </label>
                  <input
                    value={couponModalData.percent}
                    onChange={handleCouponModalInputChange}
                    name="percent"
                    id="percent"
                    type="text"
                    className="form-control"
                    placeholder="請輸入折扣"
                  />
                </div>
    
                <div className="mb-3">
                  <label htmlFor="code" className="form-label">
                    優惠碼
                  </label>
                  <input
                    value={couponModalData.code}
                    onChange={handleCouponModalInputChange}
                    name="code"
                    id="code"
                    type="text"
                    className="form-control"
                    placeholder="請輸入優惠碼"
                  />
                </div>
    
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label htmlFor="due_date" className="form-label">
                      有效期限
                    </label>
                    <input
                      value={couponModalData.due_date}
                      onChange={handleCouponModalInputChange}
                      name="due_date"
                      id="due_date"
                      type="date"
                      className="form-control"
                      placeholder="請輸入有效期限"
                    />
                  </div>
    
                  <div className="form-check">
                    <input
                      checked={couponModalData.is_enabled}
                      onChange={handleCouponModalInputChange}
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="is_enabled"
                    />
                    <label className="form-check-label" htmlFor="isEnabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
    
          <div className="modal-footer border-top bg-light">
            <button onClick={handleCouponModalClose} type="button" className="btn btn-secondary">
              取消
            </button>
            <button onClick={handleUpdateCoupon} type="button" className="btn btn-primary">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
    }

    {/*刪除Modal*/}
    <div
      ref={delCouponModalRef}
      className="modal fade"
      id="delCouponModal"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">刪除產品</h1>
            <button
              onClick={handleDelCouponModalClose}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            你是否要刪除 
            <span className="text-danger fw-bold">{tempCoupon.title}</span>
          </div>
          <div className="modal-footer">
            <button
              onClick={handleDelCouponModalClose}
              type="button"
              className="btn btn-secondary"
            >
              取消
            </button>
            <button onClick={handleDelCoupon} type="button" className="btn btn-danger">
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
    <Toast />
  </>)
}

export default CouponCatalog;