import { useState } from "react";
import axios from 'axios';
import { RingLoader } from 'react-spinners';
import { useNavigate } from "react-router";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminLogin ({setIsAuth}) {
    const [account, setAccount] = useState({
      username:'',
      password:''
    });

    // 跟在登入按鈕後的loading
    const [isLoading, setIsLoading] = useState(false);

    // 帳號輸入後改變的方法
    const handleInputChange = (e) => {
      const { value, name } = e.target
      setAccount({
        ...account,
        [name]: value
      })
    }

    const navigate = useNavigate();

    const handleLogin = async(e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account);
        // 把token與到期日從資料中解構出來
        const { token, expired } = res.data;
        // console.log(token, expired) 確認是否成功存取
        // 存取在cookie中
        document.cookie = `beeToken=${token}; expires=${new Date(expired).toUTCString()}`;
        axios.defaults.headers.common['Authorization'] = token;
        setIsAuth(true)
      } catch (error) {
        alert(error.response?.data?.message || "登入失敗")
        console.dir(error);
      } finally {
        setIsLoading(false);
      }
    }

    return(<>
      <div className="login-section bg-primary-100">   
        <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
          <h1 className="mb-5">管理者登入</h1>
          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            <div className="form-floating mb-3">
              <input name="username" value={account.username} onChange={handleInputChange} type="email" className="form-control" id="username" placeholder="name@example.com" />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input name="password" value={account.password} onChange={handleInputChange} type="password" className="form-control" id="password" placeholder="Password" />
              <label htmlFor="password">Password</label>
            </div>
            <button 
            className="btn btn-primary d-flex justify-content-center align-items-center text-light"
            disabled={isLoading}>
            登入</button>
            {isLoading && (<RingLoader color="#000" size={15} />)}
          </form>
          <p className="mt-5 mb-3 text-muted">&copy; 2025~∞ - 筆筆書櫃</p>
        </div>
      </div>
    </>)
}

export default AdminLogin;