import { getByLabelText, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import store from "../../../store";
import { BrowserRouter } from "react-router-dom";
import MobileVerification from "../mobileVerification";

/* This is a test that checks the rendering of the Mobile Verification component. */

test("renders Mobile Verification Component Correctly", () => {
  let root = document.createElement("div");

  render(
    <Provider store={store}>
      <BrowserRouter>
        <MobileVerification />
      </BrowserRouter>
    </Provider>
  );

  const verificationField = screen.getByLabelText("Enter Verification Code");


  expect(verificationField).toBeDisabled()
});
