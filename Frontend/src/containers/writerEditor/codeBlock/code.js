import { TextareaAutosize } from "@mui/base";
import { makeStyles } from "@mui/styles";
import { useState } from "react";

const Code = ({ onDataChange, data, readOnly }) => {
    const classes = useStyles();
    const [text, setText] = useState(data.text);
    const handleQuote = (e) => {
        setText(e.target.value);
        onDataChange(e.target.value);
    }
    if(!data.text && readOnly){
        return <></>
    }
    return (
        <blockquote className={classes.blockQuote} cite="https://datatracker.ietf.org/doc/html/rfc1149">
            <TextareaAutosize placeholder="Enter Code Snippet"contentEditable className={classes.blockInput} value={text} onChange={handleQuote} />
        </blockquote>
    );
}

const useStyles = makeStyles({
    blockQuote: {
        fontSize: '50px',
        // textTransform: 'uppercase',
        marginBottom: '3%',
        // paddingLeft: '10px',
        // borderLeft: '5px linear-gradient(128.16deg, #2B56FF 100%, #1395FD 90.57%)',
        // borderImageSlice: '60 30',
        // borderImageSource: 'linear-gradient(to left, #743ad5, #d53a9d)',
        // display: 'inline-flex',
        border: '0px solid white',
        // borderStyle: 'solid',
        // borderWidth: '10px',
        // borderBottom: 'none',
        // borderRight: 'none !important',
        // borderTop: 'none !important',
        // borderImage: 'linear-gradient(rgba(43, 86, 255, 1), rgba(19, 149, 253, 1)) 1',
        width: '100%',
        marginLeft: '0px',
    },

    blockInput: {
        // marginTop: '-10px',
        // marginBottom: '-10px',
        minHeight: '100px',
        minWidth: 'calc(100% - 20px)',
        // width: '100%',
        padding: '10px 10px 0px 10px',
        // maringLeft: '-20px',
        fontFamily: 'Consolas',
        fontSize: '14px',
        border: '0px',
        color: '#616161',
        // lineHeight: '38px',
        // minWidth: '100%',
        '&:focus': {
            outline: 'none',
        },
        height: 'auto',
        resize: 'none',
        backgroundColor: '#f0ecf4',
    }
})

export default Code;