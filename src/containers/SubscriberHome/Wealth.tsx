import React from 'react'
import OneImgTwoColsNewsLayout from './OneImgTwoColsNewsLayout'
import TextImageMiddile from 'components/TextImageMiddile'
import WealthWebstory from 'components/WealthWebstory';
import { ET_WEB_URL } from "../../utils/common";
import SectionHeaderWithNewsletter from './SectionHeaderWithNewsletter';

export default function Wealth({ title, data, wealthslideshow, wealthWebStories }) {    
  return (
    <>
    <section className="wealth" data-ga-impression={`Subscriber Homepage#Wealth widget impression#`}>      
      <SectionHeaderWithNewsletter url="/personal-finance" title={title} sid="5f5a31db80f79664e95679cb" />
      <div className="mainWealt">
        <div className="WealtF">
          <OneImgTwoColsNewsLayout data={data} more={{text: "Wealth", link: "/personal-finance"}} widget="Wealth"/>
        </div>
        <div className="WealtS">
          <div className="second">
            <TextImageMiddile data={wealthslideshow.data || []} heading={wealthslideshow.title || ""} widget="Wealth"/>
          </div>
          <div className="third">
            <WealthWebstory data={wealthWebStories.data || []} heading={wealthWebStories.title || ""} />
          </div>
          <div className="cals_wrap">
            <h2 className="cals_heading">Tools & Calculators</h2>
            <ul className="">
              <li className="tc_list">
                <a target="_blank" href={`${ET_WEB_URL}/wealth/calculators/income-tax-calculator`} data-ga-onclick={`Subscriber Homepage#Wealth widget click#Tax Calculator`}>
                  <span className="subSprite tax_icon"></span>
                  <div className="dib tc_detail">
                    <span className="tc_name">Income Tax Calculator</span><span className="tc_btn">FIND OUT NOW</span>
                  </div>
                </a>
              </li>
              <li className="tc_list">
                <a target="_blank" href={`${ET_WEB_URL}/wealth/ifsc-bank-code`} data-ga-onclick={`Subscriber Homepage#Wealth widget click#IFSC Code Finder`}>
                  <span className="subSprite ifsc_icon"></span>
                  <div className="dib tc_detail">
                    <span className="tc_name">IFSC Code Finder</span><span className="tc_btn">FIND OUT NOW</span>
                  </div>
                </a>
              </li>
              <li className="tc_list">
                <a target="_blank" href={`${ET_WEB_URL}/wealth/calculators/employees-provident-fund`} data-ga-onclick={`Subscriber Homepage#Wealth widget click#EPF Calculator`}>
                  <span className="subSprite epf_icon"></span>
                  <div className="dib tc_detail">
                    <span className="tc_name">EPF Calculator</span><span className="tc_btn">FIND OUT NOW</span>
                  </div>
                  </a>
                </li>
            </ul>
          </div>
        </div>
      </div>
      
        
    </section>
    <style jsx>{`
      .wealth {
        padding-bottom: 50px;
        border-top: 1px solid #9b8680;
        margin-bottom: 1px;
        border-bottom: 1px solid #9b8680;
        padding-top: 1px;
        
        .mainWealt{display: flex;
          .WealtF{
            width: 710px;
            display: table-cell;
          }
          .WealtS{
            width: 585px;
            display: table-cell;
          }          
        }
        .second{
          width: 253px;
          display: inline-block;
          vertical-align: top;
          margin: 0 20px;
        }
        .third {
          width: 275px;
          display: inline-block;
          vertical-align: top;
        }
        .cals_wrap{
            width:530px;
            margin-left: 30px;
            
            .cals_heading{
              font-size: 18px;
              padding-top: 15px;
              border-top: 0;
              margin-bottom: 10px;
              text-transform: capitalize;
            }
            .cals_heading:after {
                content: '';
                display: inline-block;
                width: 7px;
                height: 7px;
                top: -1px;
                left: 2px;
                border-top: 2px solid #ed193b;
                border-left: 2px solid #ed193b;
                position: relative;
                cursor: pointer;
                transform: rotate(135deg);
            }
           .tc_list {
              list-style: none;
              width: 164px;
              background-color: #fff6f2;
              border: solid 1px #ddc2bb;
              box-sizing: border-box;
              padding: 8px 9px 10px;
              display: flex;
              float: left;
              .tax_icon {
                  width: 40px;
                  height: 40px;
                  background-position: -424px -522px;
              }
              .ifsc_icon {
                  width: 40px;
                  height: 40px;
                  background-position: -394px -232px;
              } 
              .epf_icon {
                  width: 40px;
                  height: 48px;
                  background-position: -394px -283px;
              } 
              .tc_name {
                  font-size: 14px;
                  font-weight: 500;
                  line-height: 1.14;
              } 
              .tc_btn {
                  font-size: 9px;
                  color: #fff;
                  font-weight: bold;
                  border-radius: 2px;
                  background-color: #ed193b;
                  width: 89px;
                  height: 15px;
                  padding: 2px 0;
                  box-sizing: border-box;
                  display: block;
                  text-align: center;
                  margin: 5px auto 0;
              } 
              .tc_detail {
                  width: 89px;
                  margin-left: 13px;
              }
            } 
            .tc_list+.tc_list {margin-left: 18px;}
            .subSprite {
              background: url("https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg") no-repeat;
              display: inline-block;
              background-size: 475px;
            }
        }
      }

    `}</style>
    </>
  )
}
