import { useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal } from "bootstrap";
import { useDispatch } from 'react-redux';
import { pushMessage } from '../slice/ToastSlice';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function DelProductModal({
    isOpen,
    setIsOpen,
    getProducts,
    tempProduct
}) {
    // 選擇刪除Modal的useRef
    const delProductModalRef = useRef(null);
    // 畫面渲染後才選取Modal的DOM元素
    useEffect (() => {
      new Modal(delProductModalRef.current, {
        backdrop: false,
      })
    }, [])

    // 若isOpen為true，再把他打開
    useEffect(() => {
        if(isOpen) {
            const modalInstance = Modal.getInstance(delProductModalRef.current);
            modalInstance.show();
        }
    },[isOpen])

    const dispatch = useDispatch();

    // 刪除資料API
    const delProduct = async () => {
      try {
        // 呼叫的API連結與要代入的資料
        const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`)
        console.log(res.data.data)
      } catch (error) {
        alert(error.response?.data?.message || "刪除資料失敗")
      }
    }

    // 刪除資料方法
    const handleDelProduct = async() => {
      try {
        await delProduct();
        getProducts();
        handleDelProductModalClose();
        dispatch(pushMessage({
          text: '刪除產品成功',
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

    // 關閉刪除Modal的彈跳視窗
    const handleDelProductModalClose = () => {
      const modalInstance = Modal.getInstance(delProductModalRef.current);
      modalInstance.hide();
      setIsOpen(false);
    }

    return(<>
    <div
      ref={delProductModalRef}
      className="modal fade"
      id="delProductModal"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">刪除產品</h1>
            <button
              onClick={handleDelProductModalClose}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            你是否要刪除 
            <span className="text-danger fw-bold">{tempProduct.title}</span>
          </div>
          <div className="modal-footer">
            <button
              onClick={handleDelProductModalClose}
              type="button"
              className="btn btn-secondary"
            >
              取消
            </button>
            <button onClick={handleDelProduct} type="button" className="btn btn-danger">
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
</>)
}
export default DelProductModal