import { makeStyles } from "@mui/styles";
import carouselPNG from './../../Images/carouselPNG.png';

const CarouselItem = ({
    dummyImage,
}) => {
    const classes = useStyles();
    return (
        <div className={classes.carouselItem}>
            <div className={classes.carouselItemsLeft}>
                <div className={classes.carouselImageLeftContainer}>
                    <img className={classes.carouselImageLeft} src={dummyImage} />
                </div>
                <div className={classes.carouselLeftContentContainer}>
                    <div className={classes.carouselLeftContent}>
                        <div className={classes.carouselImageLeftTitle}>Watch Apple's WWDC keynote live right here a sjfha sjfg jasg sja gsjasga jhgf jasgf</div>
                        <div className={classes.carouselImageLeftSubtitle}>It appears the feature will work on Chromebooks and PCs running Chrome as…</div>
                        <div className={classes.carouselImageLeftButton}>Read More</div>
                    </div>
                </div>
            </div>
            <div className={classes.carouselItemsRight}>
                <img className={classes.carouselImageRight} src={dummyImage} />
            </div>
        </div >
    );
}

const useStyles = makeStyles({
    carouselItem: {
        width: '100%',
        display: 'flex',
        overflow: 'hidden',
        // height: '30rem',
        // maxHeight: '50rem',
    },

    carouselItemsLeft: {
        width: '55%',
        ['@media (max-width:720px)']: { // eslint-disable-line no-useless-computed-key
            width: '100%',
            overflow: 'hidden',
            backgroundColor: '#565656',
        },
        height: '28rem',
    },

    carouselItemsRight: {
        position: 'absolute',
        marginLeft: '50%',
        boxShadow: '1px 10px 100px rgba(0, 0, 0, 1)',
        width: '50%',
        minHeight: '25rem',
        maxHeight: '25rem',
        borderRadius: '20px',
        overflow: 'hidden',
        zIndex: '1',
        ['@media (max-width:720px)']: { // eslint-disable-line no-useless-computed-key
            display: 'none',
        }
    },

    carouselImageLeftContainer: {
        filter: 'brightness(50%)',
        height: '100%',
        overflow: 'hidden',
        // height: '28rem',
        zIndex: '0',
    },

    carouselImageLeft: {
        minWidth: '60vw',
        maxWidth: '60vw',
        minHeight: '40vw',
        maxHeight: '40vw',
        transform: 'translate(-10%, -10%)',
        ['@media (max-width:720px)']: { // eslint-disable-line no-useless-computed-key
            minWidth: '100vw',
            maxWidth: '100vw',
        },
        filter: 'blur(10px)',
        objectFit: 'cover',
        pointerEvents: 'none',
    },

    carouselLeftContentContainer: {
        // display: 'flex',
        // flexDirection: 'column',
        // justifyContent: 'center',
        // backgroundColor: 'red',
        // height: '50rem',
        color: 'white',
        // top: '41.9%',
        // left: '25%',
        // transform: 'translate(-50%, -50%)',
        minWidth: '45vw',
        maxWidth: '45vw',
        marginTop: '-22rem',
        ['@media (max-width:720px)']: { // eslint-disable-line no-useless-computed-key
            marginTop: '-18rem',
            minWidth: '100vw',
            maxWidth: '100vw',
        },
        position: 'absolute',
        // marginLeft: '10%',
        // height: '100%'
    },

    carouselLeftContent: {
        paddingLeft: '10%',
    },

    carouselImageLeftTitle: {
        fontSize: '2.5rem',
        fontWeight: '700',
        display: '-webkit-box',
        WebkitLineClamp: '2',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: '3.2rem',
        height: '6.5rem',
        ['@media (max-width:720px)']: { // eslint-disable-line no-useless-computed-key
            fontSize: '1.8rem',
            lineHeight: '1.8rem',
            height: '3.6rem',
            width: '80%',
            marginTop: '-5%',
        },
        width: '60%',
        // backgroundColor: 'yellow',
        fontFamily: 'Merriweather',
    },

    carouselImageLeftSubtitle: {
        fontSize: '1rem',
        display: '-webkit-box',
        WebkitLineClamp: '2',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: '1.5rem',
        height: '3rem',
        ['@media (max-width:720px)']: { // eslint-disable-line no-useless-computed-key
            fontSize: '12px',
        },
        width: '60%',
        marginTop: '2%',
    },

    carouselImageLeftButton: {
        borderRadius: '19px',
        padding: '1% 2% 1% 2%',
        color: 'white',
        border: '1px solid white',
        width: 'fit-content',
        marginTop: '2%',
        cursor: 'pointer',
        ['@media (max-width:720px)']: { // eslint-disable-line no-useless-computed-key
            fontSize: '12px'
        }
    },

    carouselImageRight: {
        minWidth: '45vw',
        maxWidth: '45vw',
        minHeight: '25rem',
        maxHeight: '25rem',
        objectFit: 'cover',
        pointerEvents: 'none',
    },
})

export default CarouselItem;