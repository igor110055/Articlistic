import { makeStyles } from "@mui/styles";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/writerDashboard');
    }, []);
    const classes = useStyles();
    return (
        <div className={classes.notFound}>
            Page not found
        </div>
    );
}

const useStyles = makeStyles({
    notFound: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '3rem',
        fontFamily: 'Poppins',
        color: '#6B6B6B',
    },
})

export default NotFound;