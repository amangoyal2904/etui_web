
import { render, screen } from "@testing-library/react";

import VideoShow from ".";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import { data } from "../../testData/videoshow";

jest.mock('fetch', () =>
  Promise.resolve({
    json: () => Promise.resolve({ rates: { CAD: 1.42 } }),
  })
);

jest.mock(
  "next/image",
  () =>
    function Image({ src, alt }) {
      return <img src={src} alt={alt} />;
    }
);

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    APP_ENV: 'test'
  }
}))

describe("VideoShow Component", () => {
  it("renders a heading", () => {
    render( 
      <Provider store={store}>
        <VideoShow {...data} />
      </Provider>      
    );
    expect(screen.getAllByRole("heading")).toBeTruthy();
  });
});
