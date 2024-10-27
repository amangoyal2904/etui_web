import React, { useState, useEffect } from 'react';

const BackToTopButton = () => {
    const [showButton, setShowButton] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 300) {
            setShowButton(true);
        } else {
            setShowButton(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div className="back-to-top">
                {showButton && (
                    <button onClick={scrollToTop} className="back-to-top-button"><span></span>BACK TO TOP</button>
                )}
            </div>
            <style jsx>{`
                .back-to-top {
                    position: fixed;
                    bottom: 95px;
                    right: 0;
                    z-index: 1000;
                }

                .back-to-top-button {
                    background: #000;
                    padding: 10px 5px 10px 10px;
                    color: #fff;
                    font-weight: 700;
                    cursor: pointer;
                    opacity: .2;
                    -webkit-transition: ease all .5s;
                    -o-transition: ease all .5s;
                    transition: ease all .5s;

                    &:hover {
                        opacity: 1;
                    }

                    span {
                        border-left: 5px solid transparent;
                        border-right: 5px solid transparent;
                        display: inline-block;
                        border-bottom: 7px solid #fff;
                        margin: 0 5px 0 0;
                        padding: 0;
                        width: 0;
                        height: 0;
                    }
                }
            `}</style>
        </>
    );
};

export default BackToTopButton;