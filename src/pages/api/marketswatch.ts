import { NextApiHandler } from "next";

const marketWatchHandler: NextApiHandler = (request, response) => {
    fetch('https://economictimes.indiatimes.com/market_ddmenu.cms')
        .then(res => {
            console.log(res);
            // response.status(200).json(json)
    })
}

export default marketWatchHandler;