import { getByLabelText, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import store from "../../store";
import { BrowserRouter } from "react-router-dom";
import EmailVerfication from "../emailVerification";

/* This is a test that checks the rendering of the loginSignUp component. */

test("renders Email Verification Component Correctly", () => {
  let root = document.createElement("div");

  render(
    <Provider store={store}>
      <BrowserRouter>
        <EmailVerfication />
      </BrowserRouter>
    </Provider>
  );

  const verificationCodeField = screen.getByLabelText("Enter Verification Code");
  expect(verificationCodeField).toBeDisabled();

});
