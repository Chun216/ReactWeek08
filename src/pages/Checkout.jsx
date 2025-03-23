function Checkout () {
    return(<>
      <div className="checkout-section bg-primary-100">
        <div className="container">
          <div className="row py-3 d-flex justify-content-center align-items-center text-center">
            <div className="col-6">
              <h3>結帳完成</h3>
              <h4>期待你們與孩子一起在繪本探險</h4>
              <p>訂單詳情已寄送至email</p>
            </div>
            <div className="col-6">
              <img src="https://plus.unsplash.com/premium_photo-1661274141618-489b54936e05?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
               className="rounded" style={{maxWidth: '400px'}} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>)
}

export default Checkout;