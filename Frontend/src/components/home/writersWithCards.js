import { makeStyles } from "@mui/styles";
import { Button, CircularProgress } from "@mui/material";
import ArticleCard from "./articleCard";
import userPhoto from './../../Images/userPhoto.jpg';
import d1 from './../../Images/dummy/image (2).png';
import d2 from './../../Images/dummy/image (3).png';
import d3 from './../../Images/dummy/image (4).png';
import d4 from './../../Images/dummy/image (5).png';
import d5 from './../../Images/dummy/image (6).png';
import d6 from './../../Images/dummy/image (7).png';
import d7 from './../../Images/dummy/image (8).png';
import d8 from './../../Images/dummy/image (9).png';

const WritersWithCards = ({
    data,
}) => {
    const ds = [d1, d2, d3, d4, d5, d6, d7, d8];
    const classes = useStyles();
    return (
        <div className={classes.writersWithCardsContainer}>
            <div className={classes.writersWithCardsProfile}>
                <div className={classes.writersWithCardsProfileImageContainer}>
                    <img src={userPhoto} className={classes.writersWithCardsProfileImage} />
                </div>
                <div className={classes.writersWithCardsProfileName}>Kim Lyons</div>
            </div>
            <div className={classes.cardsList}>
                {[1, 2, 3, 4].map(() => <ArticleCard dummyImage={ds[Math.floor(Math.random() * ds.length)]} />)}
            </div>
            <Button
                sx={{
                    "&.MuiButton-text": { color: "black" },
                    '&:hover': {
                        backgroundColor: '#F6F6F7',
                    },
                    width: "2.5rem",
                    fontFamily: "Poppins",
                    fontWeight: "700",
                    fontSize: "0.9em",
                    textTransform: "capitalize",
                    backgroundColor: '#F6F6F7',
                    borderRadius: '10px',
                    border: '1px solid black',
                    marginTop: '1.5%',
                    ['@media (max-width:780px)']: { // eslint-disable-line no-useless-computed-key
                        marginTop: '3%',
                    },
                }}
                style={{ marginRight: '4%', width: '8rem' }}
            >
                {false ? <CircularProgress size={20} style={{ color: 'black' }} /> : `See more`}
            </Button>
        </div>
    );
}

const useStyles = makeStyles({
    writersWithCardsContainer: {
        width: '90vw',
        marginBottom: '5%',
        ['@media (max-width:780px)']: { // eslint-disable-line no-useless-computed-key
            marginBottom: '8%',
        },
    },

    writersWithCardsProfile: {
        display: 'flex',
        alignItems: 'center',
    },

    writersWithCardsProfileImageContainer: {
        minWidth: '50px',
        maxHeight: '50px',
        minWidth: '50px',
        maxHeight: '50px',
        borderRadius: '50%',
        overflow: 'hidden',
    },

    writersWithCardsProfileImage: {
        minWidth: '50px',
        maxWidth: '50px',
        minHeight: '50px',
        maxHeight: '50px',
        objectFit: 'cover',
    },

    writersWithCardsProfileName: {
        fontFamily: 'Merriweather',
        fontSize: '1.6rem',
        color: 'rgba(10, 43, 152, 1)',
        paddingLeft: '1%',
        fontWeight: '700',
    },

    cardsList: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '1%',
        ['@media (max-width:780px)']: { // eslint-disable-line no-useless-computed-key
            overflowX: 'auto',
            marginTop: '3%',
        },
    },
})

export default WritersWithCards;