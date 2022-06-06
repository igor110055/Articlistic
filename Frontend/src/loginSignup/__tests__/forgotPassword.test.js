import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../store";
import { BrowserRouter } from "react-router-dom";
import ForgotPasswordEmail from "../forgotPasswordEmail";
import ForgotPasswordNumber from "../forgotPasswordNumber";

/* This is a test that checks the rendering of the Mobile Verification component. */

test("renders Forgot Password Email  Component Correctly", () => {
  let root = document.createElement("div");

  render(
    <Provider store={store}>
      <BrowserRouter>
        <ForgotPasswordEmail />
      </BrowserRouter>
    </Provider>
  );

  const verificationField = screen.getByLabelText("Enter Verification Code *");


  expect(verificationField).toBeDisabled()
});

test("renders Forgot Password Mobile Component Correctly", () => {

  render(
    <Provider store={store}>
      <BrowserRouter>
        <ForgotPasswordNumber />
      </BrowserRouter>
    </Provider>
  );

  const verificationField = screen.getByLabelText("Enter Verification Code *");


  expect(verificationField).toBeDisabled()
});
