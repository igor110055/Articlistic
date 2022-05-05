import { makeStyles } from '@mui/styles';
import userPhoto from './../../Images/userPhoto.jpg';
import userImage from './../../Images/user-image.png';

const WritersList = () => {
    const classes = useStyles();
    return (
        <div className={classes.writerListContainer}>
            {['Jack Level', 'Reiner Diesel', 'Erer Yearger', 'Mikasa Ackerman'].map((eachCard, index) => <div className={classes.writersWithCardsProfile}>
                <div className={classes.writersWithCardsProfileImageContainer}>
                    {index % 2 == 0 ? <img src={userPhoto} className={classes.writersWithCardsProfileImage} /> :
                        <img src={userImage} className={classes.writersWithCardsProfileImage} />}
                </div>
                <div className={classes.smallName}>{eachCard.slice(0, eachCard.search(' '))}</div>
            </div>)}
        </div>
    );
}

const useStyles = makeStyles({
    writerListContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        width: '100%',
        width: '100vw',
        overflowX: 'auto',
    },
    writersWithCardsProfile: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '4%',
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
        fontSize: '1rem',
        paddingLeft: '10%',
        color: 'rgba(99, 99, 99, 1)',
        fontWeight: '500',
    },

    smallName: {
        fontSize: '9px',
        textAlign: 'center',
        maxWidth: '45px',
    },
})

export default WritersList;