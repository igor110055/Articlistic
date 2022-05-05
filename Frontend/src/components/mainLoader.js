import logo from './../Images/icon_only.svg';
import './mainLoader.css';
import { makeStyles } from '@mui/styles';

const MainLoader = () => {
    const classes = useStyles();
    return (
        <div className={classes.logoContainer}>
            <img src={logo} alt="image" className='rotate'/>
        </div>
    );
}

const useStyles = makeStyles(({
    logoContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '3',
        minHeight: '100vh',
    },

    logo: {
        minWidth: '200px',
        maxWidth: '200px',
        minHeight: '200px',
        maxHeight: '200px',
        animation: 'rotae 3s infinite linear',
    }
}))

export default MainLoader;