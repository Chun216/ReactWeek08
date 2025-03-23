import { Link, Outlet } from "react-router";

function BooksList () {

  return(<>
    <div className="bg-primary-100">
      <div className="container py-2">
        <div className="row">
        <div className="col-xxl-2 col-12 mt-4">
          <ul className="text-dark d-sm-flex d-none flex-xxl-column flex-row justify-content-xxl-center justify-content-between list-unstyled fs-lg-3 fs-md-5 fs-sm-6">
            <li style={{paddingTop: '32px'}}>  
              <Link to='' className="link-primary-200">全部</Link>
            </li>
            <li style={{paddingTop: '32px'}}>  
              <Link to='daily' className="link-primary-200">日常生活</Link>
            </li>
            <li style={{paddingTop: '32px'}}>  
              <Link to='problemsolving' className="link-primary-200">解決問題</Link>
            </li>
            <li style={{paddingTop: '32px'}}>  
              <Link to='knowmyself' className="link-primary-200">認識自己</Link>
            </li>
            <li style={{paddingTop: '32px'}}>  
              <Link to='friends' className="link-primary-200">朋友相處</Link>
            </li>
            <li style={{paddingTop: '32px'}}>  
              <Link to='festival' className="link-primary-200">節慶團圓</Link>
            </li>
            <li style={{paddingTop: '32px'}}>  
              <Link to='tale' className="link-primary-200">傳說故事</Link>
            </li>
            <li style={{paddingTop: '32px'}}>  
              <Link to='earth' className="link-primary-200">愛護地球</Link>
            </li>
          </ul>
            {/*尺寸sm以下的排版*/}
          <ul className="list-unstyled d-flex d-sm-none flex-column">  
            <div className="d-flex justify-content-between">
                <li style={{paddingTop: '32px'}}>  
                  <Link to='' className="link-primary-200">全部</Link>
                </li>
                <li style={{paddingTop: '32px'}}>  
                  <Link to='daily' className="link-primary-200">日常生活</Link>
                </li>
                <li style={{paddingTop: '32px'}}>  
                  <Link to='problemsolving' className="link-primary-200">解決問題</Link>
                </li>
                <li style={{paddingTop: '32px'}}>  
                  <Link to='knowmyself' className="link-primary-200">認識自己</Link>
                </li>
            </div>
            <div className="d-flex justify-content-between">
                <li style={{paddingTop: '32px'}}>  
                  <Link to='friends' className="link-primary-200">朋友相處</Link>
                </li>
                <li style={{paddingTop: '32px'}}>  
                  <Link to='festival' className="link-primary-200">節慶團圓</Link>
                </li>
                <li style={{paddingTop: '32px'}}>  
                  <Link to='tale' className="link-primary-200">傳說故事</Link>
                </li>
                <li style={{paddingTop: '32px'}}>  
                  <Link to='earth' className="link-primary-200">愛護地球</Link>
                </li>
            </div>           
          </ul>
        </div>
        <div className="col-xxl-10 col-12 mb-5">
          <Outlet />
        </div>
      </div>
      {/* {
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
      } */}
      </div>
    </div>
  </>)
}

export default BooksList;