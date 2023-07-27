
import { render, screen } from "@testing-library/react";

import GreyDivider from ".";


describe("EditionTimeStamp Component", () => {
  it("renders a divider", () => {
    render( 
      <GreyDivider />   
    );
    expect(screen.getByTestId('divider')).toBeTruthy();
  });
});