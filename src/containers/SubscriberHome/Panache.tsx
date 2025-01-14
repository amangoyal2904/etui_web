import PanacheSlideshow from "components/PanacheSlideshow";
import React from "react";
import { changeImageWidthHeight } from "utils";
import { ET_WAP_URL, ET_WEB_URL } from "utils/common";
import MoreFromLink from "./MoreFromLink";

export default function Panache({ title, data, panacheVideosSlideshows }) {
  const first = data?.[0];
  const secondThird = data?.slice(1, 3);
  const rest = data?.slice(3);

  return (
    <>
      <section className="panache secBox" data-ga-impression={`Subscriber Homepage#Panache widget impression#`}>
        <h2><a href={`${ET_WEB_URL}/panache`} target="_blank" data-ga-onclick={`Subscriber Homepage#Panache widget click#title - href`}>{title}</a></h2>
        <div className="flex Pleft">
          <a className="firstBox" href={first?.url?.replace(ET_WAP_URL, ET_WEB_URL)} target="_blank" data-ga-onclick={`Subscriber Homepage#Panache widget click#1 - href`}>
            <figure>
              <img
                src={changeImageWidthHeight({imageUrl: first?.img, desiredWidth: 335, desiredHeight: 507, desiredResizeMode: 6, quality: 100})}
                alt={first?.title}
                width={335}
                height={507}
                title={first?.title}
                loading="lazy" 
              />
              <figcaption>{first?.title}</figcaption>
            </figure>
            <span className="overlay"></span>
          </a>

          <div className="secondThird">
            {secondThird?.map((item, index) => {
              return (
                <a key={index} href={item?.url?.replace(ET_WAP_URL, ET_WEB_URL)} target="_blank" data-ga-onclick={`Subscriber Homepage#Panache widget click#${index+2} - href`}>
                  {item?.title}
                  <img
                    src={changeImageWidthHeight({imageUrl: item?.img, desiredWidth: 255, desiredHeight: 162})}
                    alt={item?.title}
                    width={255}
                    height={162}
                    title={item?.title}
                    loading="lazy" 
                  />
                </a>
              );
            })}                        
          </div>

          <div className="rest">
            {rest?.map((item, index) => {
              return (
                <a key={index} href={item?.url?.replace(ET_WAP_URL, ET_WEB_URL)} target="_blank" data-ga-onclick={`Subscriber Homepage#Panache widget click#${index+4} - href`}>
                  <span>{item?.title}</span>
                  <img
                    src={changeImageWidthHeight({imageUrl: item?.img, desiredWidth: 70, desiredHeight: 54})}
                    alt={item?.title}
                    width={70}
                    height={54}
                    title={item?.title}
                    loading="lazy" 
                  />
                </a>
              );
            })}
            <MoreFromLink href="/panache" appendText="Pananche" widget="Panache widget" />
          </div>
        </div>
        <div className="third">
          <PanacheSlideshow data={panacheVideosSlideshows} heading="Videos & Slideshows" />
        </div>
      </section>
      <style jsx>{`
        .panache {
          h2 {
            font-size: 36px;
            padding-top: 35px;
            border-top: 3px solid #9b8680;
            text-transform: uppercase;
            margin-bottom: 20px;

            a {
              &::after {
                content: '';
                display: inline-block;
                width: 15px;
                height: 15px;
                top: -4px;
                left: 3px;
                border-top: 2px solid #000;
                border-left: 2px solid #000;
                position: relative;
                cursor: pointer;
                transform: rotate(135deg);
              }
            }
          }
          .firstBox {
            width: 335px;
            position: relative;
            display: inline-block;
            margin-right: 20px;

            figcaption {
              font-family: Faustina;
              font-size: 26px;
              font-weight: 600;
              line-height: 1.23;
              color: #fff;
              position: absolute;
              bottom: 20px;
              margin: 0 10px;
              z-index: 1;

              &:hover {
                text-decoration: underline;
              }
            }
            .overlay {
              display: block;
              background-image: url("https://img.etimg.com/photo/92345640.cms");
              position: absolute;
              bottom: -7px;
              left: 0;
              width: 325px;
              text-align: left;
              padding: 5px;
              background-repeat: repeat-x;
              height: 274px;
            }
          }

          .secondThird {
            width: 225px;
            display: inline-block;
            margin-right: 30px;
            vertical-align: top;

            a {
              display: block;
              color: #000;
              font-size: 18px;
              font-family: Faustina;
            }

            img {
              margin-top: 10px;
            }
          }

          .rest {
            width: 335px;
            margin-right: 30px;
            display: inline-block;
            vertical-align: top;
            a {
              display: inline-flex;
              color: #000;
              font-size: 18px;
              font-family: Faustina;
              display: inline-flex;
              border-bottom: 1px solid #ccc;
              margin-bottom: 10px;
              padding-bottom: 15px;
            }
          }
          .Pleft {
            float: left;
            width: 985px;
          }
          .third {
            width: 275px;
            display: inline-block;
            vertical-align: top;
          }
          a {
            &:hover {
              text-decoration: underline;
            }
          }
        }
      `}</style>
    </>
  );
}
