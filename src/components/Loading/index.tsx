function Loading() {
    return <>
        <div className="loaderWrap">
            <div className="spinner loading" id="divSpinner">
                <div className="loading-text font_faus">ET</div>
            </div>
        </div>

        <style jsx>{`
            .loaderWrap{position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);}
            .spinner.loading {width: 90px;height: 90px;margin: 0 auto 20px;}
            .spinner.loading:before {content: "";height: 90px;width: 90px;border-width: 5px;border-style: solid;border-color: #e30513 white white;border-radius: 100%;animation: rotation 1s infinite linear;display: inline-block;box-sizing: border-box;}
            .loading-text {color: #e30513;font-size: 26px;height: 90px;width: 90px;line-height: 80px;text-align: center;margin-top: -90px;}
            
            @keyframes rotation {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(359deg);
              }
            }
        `}</style>
    </>
}
export default Loading
