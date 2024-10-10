import useNewsletterSubscription from "components/useNewsletterSubscription";
import { useState } from "react";

export default function NewsLetter({ section }) {
  const [email, setEmail] = useState('');
  const [subs, setSubs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { initSubscription, unsubsNews } = useNewsletterSubscription();
  
  function handleSubscription(e, sid) {
    // debugger
    e.preventDefault();
    initSubscription({ sid: sid, email: email }, function (res) {
      console.log(res);
      if (res.message === 'successfully saved.') {
          setSubs(true);
        // Update UI accordingly after subscribing
        console.log("Successfully subscribed.");
        setIsLoading(false);
      }
    });
  }

  return (
    <>
      <div className="newsletter" data-name="Tech">
        <p className="sub_text">Subscribe to our { section } Newsletter</p>
        <div className="email_box">
          <input type="email" placeholder="Enter your email address" maxLength={70} value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={(e) => handleSubscription(e, '5f5a31db80f79664e95679e4')} disabled={isLoading}>{subs ? 'Subscribed' : isLoading ? 'Subscribing...' : 'Subscribe'}</button>
        </div>
      </div>
      <style jsx>{`
        .newsletter {

        }
        .sub_text {
          color: #4a4a4a;
          font-size: 12px;
        }
        .email_box {
          margin: 2px 0;
          border-radius: 2px;
          box-shadow: 0 4px 5px 0 rgba(0,0,0,0.09);

          input[type="email"] {
            width: 224px;
            background: #fff;
            outline: 0;
            line-height: 30px;
            padding: 0 8px;
            box-sizing: border-box;
            font-family: 'Montserrat';
            border-radius: 2px;
          }

          button {
            font-weight: 500;
            width: 128px;
            height: 30px;
            background: #183651;
            color: #fff;
            text-align: center;
            line-height: 30px;
            font-family: 'Montserrat';
            cursor: pointer;
            border-radius: 2px;

            &:disabled {
              background: #d8d8d8;
              cursor: not-allowed;
            }
          }
        }
      `}</style>
    </>
  )
}
