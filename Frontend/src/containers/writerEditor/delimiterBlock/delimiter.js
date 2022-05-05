import { makeStyles } from "@mui/styles";

const Delimiter = () => {
    const classes = useStyles();
    return (
        <div className={classes.delimiter}>
            . &nbsp;&nbsp;. &nbsp;&nbsp;.
        </div >
    );
}

const useStyles = makeStyles({
    delimiter: {
        textAlign: 'center',
        fontSize: '36px',
        padding: '5%',
        userSelect: 'none',
        msUserSelect: 'none',
        MozUserSelect: 'none',
        WebkitUserSelect: 'none',
    },
});

export default Delimiter;