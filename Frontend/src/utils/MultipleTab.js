import { Box, Dialog, Modal, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";



const MultipleTab = () => {
  const [open, setIsOpen] = useState(true)
  const classes = useStyles()
  return (
    // <Modal
    //   open={open}
    // //   onClose={handleClose}
    //   aria-labelledby="modal-modal-title"
    //   aria-describedby="modal-modal-description"
    // >
    //   <Box sx={style}>
    //     <Typography id="modal-modal-title" variant="h6" component="h2">
    //       Another Tab is opened
    //     </Typography>
    //     <Typography id="modal-modal-description" sx={{ mt: 2 }}>
    //       Please close the other tab and refresh the website
    //     </Typography>
    //   </Box>
    // </Modal>
    <Dialog
    open={open}
    classes={{
      paper: classes.dialogPaper,
    }}
    sx={{
      "& .MuiPaper-root": {
        borderRadius: "10px",
        height: "max-content",
      },
    }}
    onClose={(e) => {
      e.preventDefault();
      return;
    }}
  >
     <Typography id="modal-modal-title" sx={{fontWeight: 'bold', fontFamily: 'Poppins'}} variant="h6" component="h2">
     Attentioun is already running on another tab 🤪
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2, fontFamily: 'Poppins'}}>
         Please close the other tab and refresh the website
      </Typography>
  </Dialog>
  );
};


const useStyles = makeStyles({
  dialog: {
    width: "100vw",
  },

  dialogPaper: {
    // minHeight: "40vh",
    // maxHeight: "35vh",
    // minWidth: "30vw",
    // maxWidth: "30vw",
    height: "fit-content",
    width: "fit-content",
    padding: "1%",
  },
})

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

export default MultipleTab