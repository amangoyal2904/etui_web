import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './styles.module.scss';
import './slikCustom.css';

interface TrendingProps {
  data: { title: string; url: string }[]; // Define the type of data prop
  title: string;
}

export default function Trending({ data, title }: TrendingProps) {
  const CustomPrevArrow = (props) => {
    const { className, style, onClick } = props;
    return <div className={`${className} arw_blk`} onClick={onClick}><span className="alft"></span></div>;
  };

  const CustomNextArrow = (props) => {
    const { className, style, onClick } = props;
    return <div className={`${className} arw_blk`}  onClick={onClick}><span className="aryt"></span></div>;
  };

  const subsets: { title: string; url: string }[][] = [];
  const chunkSize = 4;

  // Split data into subsets of 4 items each
  for (let i = 0; i < data.length; i += chunkSize) {
    subsets.push(data.slice(i, i + chunkSize));
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow className={styles.prevBtn}/>,
    nextArrow: <CustomNextArrow className={styles.nextBtn}/>,
  };
  

  return (
    <div className={`${styles.trending} trending ${global.test}`}>
      <h2>{title}</h2>
      <Slider {...settings}>
        {subsets.map((subset, i) => (
          <div key={`subset_${i}`}>
            {subset.map((item, j) => (
              <a href={item.url} key={`trending_${i}_${j}`}>{item.title}</a>
            ))}
          </div>
        ))}
      </Slider>
    </div>
  );
}
