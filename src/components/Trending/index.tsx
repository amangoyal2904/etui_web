import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './styles.module.scss';

export default function Trending({data, title}: {data: any, title: string}) {
  const CustomPrevArrow = (props) => {
    const { className, style, onClick } = props;
    return <div className={`${className} arw_blk`} onClick={onClick}><span className="alft"></span></div>;
  };

  const CustomNextArrow = (props) => {
    const { className, style, onClick } = props;
    return <div className={`${className} arw_blk`}  onClick={onClick}><span className="aryt"></span></div>;
  };
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    prevArrow: <CustomPrevArrow className={styles.prevBtn}/>,
    nextArrow: <CustomNextArrow className={styles.nextBtn}/>,
  };
  
  
  console.log(data);

  return (
    <div className={`${styles.trending} trending`}>
      <h2>{title}</h2>
      <Slider {...settings}>
      {
        data && Array.isArray(data) && data.map((item, i) => {
          return <li className={styles.name} key={`trending_${i}`}><a href={item.url}>{item.title} </a></li>
        })
      }
      </Slider>
      
    </div>
  );
}