import { NextResponse } from "next/server";
import APIS_CONFIG from "network/config.json";

// ... existing code ...
const APP_ENV = "development";

const callAPIforData = async (bodypayload: any) => {
  const apiUrl = (APIS_CONFIG as any)?.liveStream[APP_ENV] + "/getEventData";
  console.log("apiUrl", apiUrl);
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bodypayload),
    cache: "no-store"
  });
  const newData = await response.json();
  return newData;
};

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Get JSON data from the request
    const paramData = { ...data }; // Gather all parameters into paramData

    //console.log(paramData);
    const getData = await callAPIforData(paramData);

    return NextResponse.json({ message: "Success", livestreamdata: getData }); // Respond with JSON
  } catch (error) {
    return NextResponse.json({ message: "Error", error: error.message }, { status: 500 }); // Handle errors
  }
}

// ... existing code ...
