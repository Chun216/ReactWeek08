import { useNavigate } from "react-router";
import { useEffect } from "react";

function NotFound () {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/')
    }, 2000)
  }, [navigate])
  
  return(<>
    <h1>此頁面不存在</h1>
  </>)
}

export default NotFound;