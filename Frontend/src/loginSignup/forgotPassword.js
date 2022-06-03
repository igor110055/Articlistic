import { makeStyles } from "@mui/styles";
import ForgotPasswordEmail from "./forgotPasswordEmail";
import ForgotPasswordNumber from "./forgotPasswordNumber";

const ForgotPassword = ({
  setOpenDialog,
  setOpenNewPassword,
  boxToBeOpened,
  setEntityForDialog,
  setTypeForDialog,
}) => {

  return (
    <div>
      {boxToBeOpened === "Email" && (
        <ForgotPasswordEmail
          setOpenDialog={setOpenDialog}
          setOpenNewPassword={setOpenNewPassword}
          setEntityForDialog={setEntityForDialog}
          setTypeForDialog={setTypeForDialog}
        />
      )}
      {boxToBeOpened === "Phone" && (
        <ForgotPasswordNumber
          setOpenDialog={setOpenDialog}
          setOpenNewPassword={setOpenNewPassword}
          setEntityForDialog={setEntityForDialog}
          setTypeForDialog={setTypeForDialog}
        />
      )}
    </div>
  );
};
const useStyles = makeStyles({
  chooseButton: {
    display: "flex",
    justifyContent: "space-around",
    padding: "3%",
  },
});

export default ForgotPassword;
