import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { Toast as bsToast } from "bootstrap";
import { removeMessage } from "../slice/ToastSlice";

function Toast () {
  const messages = useSelector((state) => state.toast.messages);
  console.log(messages);

  const toastRefs = useRef({});
  
  const dispatch = useDispatch();

  // 當 messages 陣列發生變化時，會遍歷每一個 message，找到對應的 DOM 元素，
  // 並用 Bootstrap 的 Toast 類別來顯示它們。
  useEffect(() => {
    messages.forEach((message) => {
      const messageElement = toastRefs.current[message.id];
      if (messageElement) {
        const toastInstance = new bsToast(messageElement); 
        toastInstance.show();
        // 待2秒後予以刪除
        setTimeout(() => {
          dispatch(removeMessage(message.id))
        }, 2000)
      }
    })
  }, [messages])

  // 手動關閉跳出訊息
  const handleDismiss = (message_id) => {
    dispatch(removeMessage(message_id))
  }


  return(<>
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1000 }}>
      {
        messages.map((message) => (
          <div ref={(el) => (toastRefs.current[message.id] = el)} key={message.id} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div className={`toast-header ${message.status === 'success' ? 'bg-success' : 'bg-danger'} text-white`}>
              <strong className="me-auto">{message.status === 'success' ? '成功' : '失敗'}</strong>
              <button
                onClick={() => handleDismiss(message.id)}
                type="button"
                className="btn-close"
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body">{message.text}</div>
          </div>
        ))
      }
    </div>
  </>)
}

export default Toast;