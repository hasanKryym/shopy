import { Swiper, SwiperSlide } from "swiper/react";
import "./HomeSlider.css";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { getSliderProducts } from "../../data/fetchingData";
import SliderProduct from "./SliderProduct/SliderProduct";
import { getProductsById } from "../../data/PostingData";
import Loader from "../Loader/Loader";

const HomeSlider = () => {
  const [swiperProducts, setSwiperProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const productIds = getSliderProducts();
    productIds.then((ids) => {
      // if there are no products added to the slider return
      if (ids.length === 0) {
        setIsLoading(false);
        return;
      }
      const Products = getProductsById(ids);
      Products.then((res) => {
        setSwiperProducts(res);
        setIsLoading(false);
      });
    });
  }, []);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="swiper_container">
          <Swiper
            className="swiper"
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            //   onSwiper={(swiper) => console.log(swiper)}
            //   onSlideChange={() => console.log("slide change")}
          >
            {swiperProducts.map((product) => {
              return (
                <SwiperSlide key={product._id}>
                  <SliderProduct {...product} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </>
  );
};

export default HomeSlider;
