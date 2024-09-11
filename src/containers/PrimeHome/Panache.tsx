import React from 'react'

export default function Panache({ title, data }) {

  function changeFirstImageWidthHeight(imageUrl, desiredWidth, desiredHeight, desiredResizeMode) {
    const newUrl = imageUrl.replace(/width-\d+/g, `width-${desiredWidth}`).replace(/height-\d+/g, `height-${desiredHeight}`);

    if(desiredResizeMode) {
      return newUrl.replace(/resizemode-\w+/g, `resizemode-${desiredResizeMode}`);
    }

    return newUrl;
  }

  const first = data?.[0];
  const secondThird = data?.slice(1, 3);
  const rest = data?.slice(3);

  return (
    <>
      <section className="panache secBox">
        <h2>{title}</h2>
        <div className="flex">          
          <a href={first?.title} className="firstBox">
            <figure>
              <img src={changeFirstImageWidthHeight(first?.img, 335, 507, 6)} alt={first?.title} width={335} height={507} title={first?.title} />
              <figcaption>{first?.title}</figcaption>
            </figure>
            <span className="overlay"></span>
          </a>

          <div className="secondThird">
          {
            secondThird?.map((item, index) => {
              return (
                <a key={index} href={item?.title}>
                  {item?.title}
                  <img src={changeFirstImageWidthHeight(item?.img, 255, 162, 4)} alt={item?.title} width={255} height={162} title={item?.title} />                  
                </a>
              )
            })
          }
          </div>

          <div className="rest">
          {
            rest?.map((item, index) => {
              return (
                <a key={index} href={item?.title}>
                  <span>{item?.title}</span>
                  <img src={changeFirstImageWidthHeight(item?.img, 70, 54, 4)} alt={item?.title} width={70} height={54} title={item?.title} />
                </a>
              )
              
            })
          }
          </div>
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
            }
            .overlay {
              display: block;
              background-image: url(https://img.etimg.com/photo/92345640.cms);
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
              margin-bottom: 10px;
            }
          }

        }
      `}</style>
    </>
  )
}
