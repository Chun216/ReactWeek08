import { useState, useEffect } from "react";
import axios from 'axios';
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router";
import 'swiper/css';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const categoryMap = {
  daily: "日常生活",
  problemsolving: "解決問題",
  knowmyself: "認識自己",
  friends: "朋友相處",
  festival: "節慶團圓",
  tale: "傳說故事",
  earth: "愛護地球",
};

function Homepage () {
  const [popularBooks, setPopularBooks] = useState([]);
  // 取得所有書單列表，並從中抓6本做為熱門精選
  useEffect(() => {
    const getPopularBooks = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
        setPopularBooks(res.data.products.slice(5,10));
        console.log(res.data.products.slice(5,10));
      } catch (error) {
        alert(error.response?.data?.message || "取得熱門產品失敗")
        console.log(error);
      }
    };
    getPopularBooks();
  }, []);

  return(<>
  {/*banner carousel*/}
  <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src="https://images.unsplash.com/photo-1472162072942-cd5147eb3902?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          className="d-block w-100"
          style={{ height: '100vh', objectFit: 'cover' }}
          alt="小孩看書哈哈笑" />
          <div className="carousel-caption position-absolute w-50 top-50 start-50 translate-middle-y text-start">
            <h5 className="banner-text fs-md-1 fs-4 text-primary-200">繪本閱讀不用等認識很多字才開始<br />而是現在開始</h5>
            <p className="text-primary-300 fs-md-3 fs-6">只要選對繪本與我們的陪伴</p>
            <Link to='/bookslist'>
              <button type="button"
              className="btn rounded border-0 p-2 text-light btn-danger-100"
              >開始繪本探險</button>
            </Link>
          </div>
        </div>
        <div className="carousel-item position-relative">
          <img src="https://images.unsplash.com/photo-1518336751805-17d4ea1ba5a0?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          className="d-block w-100"
          style={{ height: '100vh', objectFit: 'cover', opacity: '0.2'}}
          alt="繪本有太多選擇" />
          <div className="carousel-caption position-absolute top-50 start-50 translate-middle text-start rounded"
          style={{opacity: '0.8'}}>
            <h5 className="banner-text fs-lg-2 fs-md-4 fs-5 text-primary-200 bg-primary-100 rounded text-center py-2 px-2">
              繪本那麼多卻選不出來?
            </h5>
            <div className="d-flex flex-md-row flex-column justify-content-md-center justify-content-start ps-4">
              <p className="text-primary-300 fs-md-4 fs-6 me-3">交給筆筆書櫃</p>
              <Link to='/bookslist/daily'>
                <button type="button"
                className="btn rounded border-0 p-2 mt-1 text-primary-300 btn-danger-100"
                >主題分類</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="carousel-item position-relative">
          <img src="https://images.unsplash.com/photo-1549737221-bef65e2604a6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          className="d-block w-100"
          style={{ height: '100vh', objectFit: 'cover', opacity: '0.7'}} 
          alt="孩子認真看書" />
          <div className="carousel-caption"
          style={{position: 'absolute', top: '15%'}}>
            <h5 className="banner-text fs-lg-1 fs-md-2 fs-sm-4 fs-5 text-primary-300"><i className="bi bi-stars text-warning pe-1"></i>無聊的時候，看繪本吧！</h5>
          </div>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
  </div>
  
  {/*熱門推薦swiper*/}
  <div className="swiper-section bg-primary-100">
    <div className="container swiper-container py-5">
        <h3 className="pb-3 text-center h1 text-primary-200" style={{fontWeight: 'bold'}}>熱門推薦</h3>
        <Swiper
          spaceBetween={10}   // 卡片間距
          breakpoints={{
            576: { slidesPerView: 1 },  // 小平板：1 張
            768: { slidesPerView: 2 },  // 中等平板：2 張
            992: { slidesPerView: 3 },  // 桌機：3 張
          }}
          loop={true}         // 啟用循環
          pagination={{ clickable: true }}  // 頁面控制
          navigation={true}   // 顯示左右導航
          className="swiper-slide d-flex justify-content-between"
        >
          {/* 顯示熱門推薦的卡片 */}
          {popularBooks.map((popularbook) => (
            <SwiperSlide key={popularbook.id}>
              <div className="card h-100">
                <img
                  src={popularbook.imageUrl} 
                  className="card-img-top"
                  alt={popularbook.title}
                  style={{
                    height: '400px',
                    objectFit: 'contain',
                    paddingRight: '2px',
                    paddingLeft: '2px',
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title h4">{popularbook.title} 
                    <span className="rounded badge text-bg-success ms-3" style={{fontSize: '14px'}}>{categoryMap[popularbook.category]}</span>
                  </h5>
                  {/*<p className="card-text">{popularbook.description}</p>  假設有 description */}
                  <Link to={`/bookslist/detail/${popularbook.id}`}>
                    <button type="button"
                      className="btn rounded border-0 p-2 text-light btn-danger-100"
                    >查看更多</button>
                  </Link>   
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
    </div>
  </div>

  {/*筆筆書櫃特色*/}
  <div className="feature-section bg-primary-100">
    <div className="container">
      <h3 className="pb-3 text-center h1 text-primary-200" style={{fontWeight: 'bold'}}>筆筆書櫃的小秘密</h3>
      <div className="row d-flex justify-content-between pb-5 g-2">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100">
            <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title text-primary-200" 
                style={{fontWeight: 'bold'}}>免費借閱情報站</h5>
              <p className="card-text text-primary-300">有些繪本線上也能免費借閱！筆筆書櫃幫你找到免費資源，讓閱讀變得更簡單。</p>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100">
            <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              className="card-img-top" alt="書櫃" />
            <div className="card-body">
              <h5 className="card-title text-primary-200"
                style={{fontWeight: 'bold'}}>選書不迷路</h5>
              <p className="card-text text-primary-300">繪本多到眼花撩亂？筆筆書櫃幫你依主題分類，輕鬆找到最適合的故事，讓選書變得簡單又有趣！</p>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100">
            <img src="https://plus.unsplash.com/premium_photo-1661380944248-8236fc4b3899?q=80&w=2066&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title text-primary-200" 
                style={{fontWeight: 'bold'}}>孩子的笑容我們記住了</h5>
              <p className="card-text text-primary-300">筆筆書櫃精選繪本，經過無數次與孩子共讀，孩子的笑聲和驚呼是最好的評價！</p>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100">
            <img src="https://plus.unsplash.com/premium_photo-1682092410852-18df7d09f773?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              className="card-img-top" alt="親子共讀" />
            <div className="card-body">
              <h5 className="card-title text-primary-200" 
                style={{fontWeight: 'bold'}}>共讀時光小祕訣</h5>
              <p className="card-text text-primary-300">不只是讀故事，還能一起玩、一起聊！筆筆書櫃提供實用的共讀小方法，讓每次翻頁都充滿歡笑。</p>
            </div>
          </div>
        </div>
        
      </div>   
    </div>
  </div>

  {/*筆筆書櫃回饋*/}
  <div className="feedback-section bg-primary-100">
    <div className="container pt-2 pb-5">
    <h3 className="pb-3 text-center h1 text-primary-200" style={{fontWeight: 'bold'}}>書櫃心得</h3>
    <div className="row g-2">
      <div className="col-md-6">
        <div className="feedbak-card d-flex bg-danger-100 rounded p-2">
          <div style={{maxWidth: '100px', maxHeight: '100px'}}>
            <img src="https://images.unsplash.com/photo-1605812830455-2fadc55bc4ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              className="rounded" style={{width: '100%',height: '100%', objectFit: 'cover'}} alt="爸爸揹著孩子" />      
          </div>  
          <div className="mx-2 text-primary-300">
            <h5 style={{fontWeight: 'bold'}}>Jonas</h5>
            <p>每次和孩子一起挑選繪本，總能發現新的驚喜，筆筆書櫃讓選書變得如此輕鬆，感覺每本書都充滿愛心和用心。</p>
          </div>
        </div> 
      </div>
      <div className="col-md-6">
        <div className="feedbak-card d-flex bg-danger-100 rounded p-2">
          <div style={{maxWidth: '100px', maxHeight: '100px'}}>
            <img src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              className="rounded" style={{width: '100%',height: '100%', objectFit: 'cover'}} alt="媽媽抱著孩子" />      
          </div>  
          <div className="mx-2 text-primary-300">
            <h5 style={{fontWeight: 'bold'}}>Kathy</h5>
            <p>線上免費借閱的資源讓我們不用出門也能拿到新書閱讀，孩子們總是期待翻開新故事，那些時光真的很珍貴。</p>
          </div>
        </div> 
      </div>
      <div className="col-md-6">
        <div className="feedbak-card d-flex bg-danger-100 rounded p-2">
          <div style={{maxWidth: '100px', maxHeight: '100px'}}>
            <img src="https://plus.unsplash.com/premium_photo-1682000277474-29f210a62174?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              className="rounded" style={{width: '100%',height: '100%', objectFit: 'cover'}} alt="媽媽抱著孩子" />      
          </div>  
          <div className="mx-2 text-primary-300">
            <h5 style={{fontWeight: 'bold'}}>Benson</h5>
            <p>筆筆書櫃的共讀小祕訣讓我們能更享受親子共讀的時光，不僅是學習，也是一段段溫馨的記憶。</p>
          </div>
        </div> 
      </div>
      <div className="col-md-6">
        <div className="feedbak-card d-flex bg-danger-100 rounded p-2">
          <div style={{maxWidth: '100px', maxHeight: '100px'}}>
            <img src="https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              className="rounded" style={{width: '100%',height: '100%', objectFit: 'cover'}} alt="媽媽抱著孩子" />      
          </div>  
          <div className="mx-2 text-primary-300">
            <h5 style={{fontWeight: 'bold'}}>Nicole</h5>
            <p>孩子的笑容是我們最珍貴的回饋，看到他們在故事中找到快樂，讓我們知道這一切的努力都是值得的。</p>
          </div>
        </div> 
      </div>
    </div>

    </div>

  </div>

  </>)
}

export default Homepage;