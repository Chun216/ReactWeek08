import { Link } from "react-router"

function Pagination({pageInfo, handlePageChange}) {
    return (<>
        {/* 分頁功能的模板 */ }
        <div className="d-flex justify-content-center">
          <nav>
            <ul className="pagination">
              {/*當pageInfo.has_pre為false，再加上不能執行*/}
              <li className={`page-item ${!pageInfo.has_pre} && 'disabled'`}>
                <Link onClick={() => handlePageChange(pageInfo.current_page - 1)} 
                  className="page-link" to={`/admin/productcatalog?page=${pageInfo.current_page - 1}`}>
                  上一頁
                </Link>
              </li>
              {/*新增一個陣列，規定陣列長度*/}
              {Array.from({ length: pageInfo.total_pages }).map((_, index) => {
                return (<li key={index} className={`page-item ${pageInfo.current_page === index + 1 && 'active'}`}>
                    <Link onClick={() => handlePageChange(index + 1)} className="page-link" to={`/admin/productcatalog?page=${index+1}`}>
                      {index + 1}  {/*因為index從零開始，所以要+1才能代表頁碼，與現在頁碼相等那就啟動*/}
                    </Link>
                  </li>
                )
              })}
              {/*當pageInfo.has_next為false，再加上不能執行*/}
              <li className={`page-item ${!pageInfo.has_next} && 'disabled'`}>
                <Link onClick={() => handlePageChange(pageInfo.current_page + 1)} 
                  className="page-link" to={`/admin/productcatalog?page=${pageInfo.current_page + 1}`}>
                  下一頁
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        </>)
}

export default Pagination