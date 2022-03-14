import { NextApiHandler } from "next";

const marketWatchHandler: NextApiHandler = (request, response) => {
    fetch('https://etdev8243.indiatimes.com/header_sale_offer_api.cms?msid=81429572&feedtype=etjson')
        .then(res => res.json())
        .then(json => {
            console.log(json);
            response.status(200).json(json)
    })
}

export default marketWatchHandler;