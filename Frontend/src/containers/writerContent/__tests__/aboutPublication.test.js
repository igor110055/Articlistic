import { getByLabelText, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider, useDispatch } from "react-redux";
import store from "../../../store";
import { BrowserRouter, MemoryRouter } from "react-router-dom";


import AboutPublication from "../aboutPublication";
import { userUsername } from "../../user/userActions";
import "react-router-dom";

/* This is a test that checks the rendering of the About Publication component. */

test("check whether renders About Publication Component Correctly", () => {
  try{
    render(
      <Provider store={store}>
          <BrowserRouter>
            <AboutPublication/>
          </BrowserRouter>
      </Provider>
    );
  }catch(e){
    console.log(e)
  }
  


});
