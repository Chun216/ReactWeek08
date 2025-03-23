import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal } from "bootstrap";
import { useDispatch } from 'react-redux';
import { pushMessage } from '../slice/ToastSlice';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({
    modalMode,
    tempProduct,
    isOpen,
    setIsOpen,
    getProducts
    }) {
    // 不想要Modal改變到tempProduct，所以新增一個狀態modalData
    const [ modalData, setModalData ] = useState(tempProduct)
    // 為了讓modalData可以跟著tempProduct走，當tempProduct更新後，modalData也觸發更新
    useEffect(() => {
        setModalData({
            ...tempProduct,
        })
    }, [tempProduct]) 

    // 用useRef選定DOM元素，並把Ref加入下方的渲染畫面中
    const productModalRef = useRef(null);
    useEffect (() => {
      // console.log(productModalRef.current) 確認是否有取得此DOM元素
      // 取消點擊Modal黑色區塊即可以關掉Modal的方法
      new Modal(productModalRef.current, {
        backdrop: false,
      })
    }, [])

    // isOpen是true，那在show Modal
    useEffect(() => {
        if(isOpen) {
            const modalInstance = Modal.getInstance(productModalRef.current);
            modalInstance.show();
        }
    },[isOpen])

    // 點擊叉叉或取消關閉Modal的方法
    const handleProductModalClose = () => {
      const modalInstance = Modal.getInstance(productModalRef.current);
      modalInstance.hide();
      setIsOpen(false)
    }

    // Modal框框內容輸入改變的方法
    const handleModalInputChange = (e) => {
      const { name, value, checked, type } = e.target;
      // 有的是輸入值、有的是勾選checkbox
      setModalData({
        ...modalData,
        [name]: type === 'checkbox' ? checked : value
      })
    }

    // 新增圖片的方法
    const handleAddImage = () => {
      const newImages = [...modalData.imagesUrl, ''];

      setModalData({
        ...modalData,
        imagesUrl: newImages
      })
    }

    // 取消圖片的方法
    const handleRemoveImage = () => {
      const newImages = [...modalData.imagesUrl];
      // 移除陣列最後一個值
      newImages.pop()
      setModalData({
        ...modalData,
        imagesUrl: newImages
      })
    }

    const dispatch = useDispatch();

    // 新增產品的API
    const createProduct = async () => {
      try {
        // 呼叫的API連結與要代入的資料
        const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, {
          data: {
            ...modalData,
            origin_price: Number(modalData.origin_price),
            price: Number(modalData.price),
            is_enabled: modalData.is_enabled ? 1 : 0,
            hasZhuyin: modalData.has_Zhuyin ? 1 : 0,
            canBorrowOnline: modalData.canBorrowOnline ? 1 : 0
          }
        })
        dispatch(pushMessage({
          text: message('新增產品成功'),
          status: 'success'
        }))
        console.log(res.data.data)
      } catch (error) {
        // alert('新增產品失敗')
        const { message } = error.response.data;
        dispatch(pushMessage({
          text: message.join('、'),
          status: 'failed'
        }))
      }
    }

    // 先看是建立新商品還是編輯商品點選確認之後，會呼叫新增產品的API，並重新取得所有資料，並關閉Modal
    const handleUpdateProduct = async() => {
      const apiCall = modalMode === 'create' ? createProduct : updateProduct
      try {
        await apiCall();
        getProducts();
        handleProductModalClose();
      } catch (error) {
        alert('編輯產品失敗')
      }
    }

    // 編輯資料
    const updateProduct = async () => {
      try {
        // 呼叫的API連結與要代入的資料
        const res = await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${modalData.id}`, {
          data: {
            ...modalData,
            origin_price: Number(modalData.origin_price),
            price: Number(modalData.price),
            is_enabled: modalData.is_enabled ? 1 : 0,
            hasZhuyin: modalData.has_Zhuyin ? 1 : 0,
            canBorrowOnline: modalData.canBorrowOnline ? 1 : 0
          }
        })
        dispatch(pushMessage({
          text: '編輯產品成功',
          status: 'success'
        }))
        console.log(res.data.data)
      } catch (error) {
        dispatch(pushMessage({
          text: message.join('、'),
          status: 'failed'
        }))
      }
    }

    // 上傳圖片
    const handleFileChange = async(e) => {
      // console.log(e.target) // 確認其內容，是file有功能
      const file = e.target.files[0]; //取得使用者選擇的檔案
  
      const formData = new FormData(); //用FormData來準備表單資料
        formData.append('file-to-upload', file) //把檔案加入其中
  
        try {
          const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/upload`, formData)
          const uploadedImageUrl = res.data.imageUrl;
          setModalData({
            ...modalData,
            imageUrl: uploadedImageUrl
          })
        } catch (error) {
          
        }
    }

    return(<>
    <div ref={productModalRef} className="modal fade" tabIndex="-1" aria-hidden="true" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fs-4">{modalMode === 'create' ? '新增產品' : '編輯產品'}</h5>
            <button onClick={handleProductModalClose} type="button" className="btn-close" aria-label="Close"></button>
          </div>
    
          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="form-check mb-4">
                  <input
                    checked={modalData.has_Zhuyin}
                    onChange={handleModalInputChange}
                    name="has_Zhuyin"
                    type="checkbox"
                    className="form-check-input"
                    id="hasZhuyin"
                  />
                  <label className="form-check-label" htmlFor="hasZhuyin">
                    是否有注音
                  </label>
                </div>
                <div className="form-check mb-4">
                  <input
                    checked={modalData.canBorrowOnline}
                    onChange={handleModalInputChange}
                    name="canBorrowOnline"
                    type="checkbox"
                    className="form-check-input"
                    id="canBorrowOnline"
                  />
                  <label className="form-check-label" htmlFor="canBorrowOnline">
                    是否有免費線上借閱
                  </label>
                </div>
                <div className="mb-5">
                  <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="form-control"
                    id="fileInput"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="primary-image" className="form-label">
                    主圖
                  </label>
                  <div className="input-group">
                    <input
                      value={modalData.imageUrl}
                      onChange={handleModalInputChange}
                      name="imageUrl"
                      type="text"
                      id="primary-image"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  <img
                    src={modalData.imageUrl}
                    alt={modalData.title}
                    className="img-fluid"
                  />
                </div>
    
                {/* 副圖 */}
                <div className="border border-2 border-dashed rounded-3 p-3">
                  {modalData.imagesUrl?.map((image, index) => (
                    <div key={index} className="mb-2">
                      <label
                        htmlFor={`imagesUrl-${index + 1}`}
                        className="form-label"
                      >
                        副圖 {index + 1}
                      </label>
                      <input
                        id={`imagesUrl-${index + 1}`}
                        type="text"
                        placeholder={`圖片網址 ${index + 1}`}
                        className="form-control mb-2"
                      />
                      {image && (
                        <img
                          src={image}
                          alt={`副圖 ${index + 1}`}
                          className="img-fluid mb-2"
                        />
                      )}
                    </div>
                  ))}
                  <div className="btn-group w-100">
                    {/*當圖片未超過5張和最後一個欄位有值就顯示新增按鈕
                    imagesUrl.length < 5 && 
                    modalData.imagesUrl[modalData.imagesUrl.length - 1] !== '' && 
                    (<button className="btn btn-outline-primary btn-sm w-100">新增圖片</button>)*/}
                    <button onClick={handleAddImage} className="btn btn-outline-primary btn-sm w-100">新增圖片</button>
                    {/*顯示取消按鈕的時機：非唯一的時候就顯示
                    modalData.imagesUrl.length > 1 && (
                    <button className="btn btn-outline-danger btn-sm w-100">取消圖片</button>) */}
                    <button onClick={handleRemoveImage} className="btn btn-outline-danger btn-sm w-100">取消圖片</button>
                  </div>
                </div>
              </div>
    
              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    標題
                  </label>
                  <input
                    value={modalData.title}
                    onChange={handleModalInputChange}
                    name="title"
                    id="title"
                    type="text"
                    className="form-control"
                    placeholder="請輸入標題"
                  />
                </div>
    
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    分類
                  </label>
                  <input
                    value={modalData.category}
                    onChange={handleModalInputChange}
                    name="category"
                    id="category"
                    type="text"
                    className="form-control"
                    placeholder="請輸入分類"
                  />
                </div>
    
                <div className="mb-3">
                  <label htmlFor="unit" className="form-label">
                    單位
                  </label>
                  <input
                    value={modalData.unit}
                    onChange={handleModalInputChange}
                    name="unit"
                    id="unit"
                    type="text"
                    className="form-control"
                    placeholder="請輸入單位"
                  />
                </div>
    
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <input
                      value={modalData.origin_price}
                      onChange={handleModalInputChange}
                      name="origin_price"
                      id="origin_price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入原價"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      value={modalData.price}
                      onChange={handleModalInputChange}
                      name="price"
                      id="price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入售價"
                    />
                  </div>
                </div>
    
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    產品描述
                  </label>
                  <textarea
                    value={modalData.description}
                    onChange={handleModalInputChange}
                    name="description"
                    id="description"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>
    
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    說明內容
                  </label>
                  <textarea
                    value={modalData.content}
                    onChange={handleModalInputChange}
                    name="content"
                    id="content"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入說明內容"
                  ></textarea>
                </div>
    
                <div className="form-check">
                  <input
                    checked={modalData.is_enabled}
                    onChange={handleModalInputChange}
                    name="is_enabled"
                    type="checkbox"
                    className="form-check-input"
                    id="isEnabled"
                  />
                  <label className="form-check-label" htmlFor="isEnabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
    
          <div className="modal-footer border-top bg-light">
            <button onClick={handleProductModalClose} type="button" className="btn btn-secondary">
              取消
            </button>
            <button onClick={handleUpdateProduct} type="button" className="btn btn-primary">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
    </>)
}

export default ProductModal