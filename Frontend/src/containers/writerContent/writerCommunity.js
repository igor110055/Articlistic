import { makeStyles } from "@mui/styles";
import communityImage from './../../Images/community.png';

const WriterCommunity = () => {
    const classes = useStyles();
    return (
        <>
        <div className={classes.communityLine}>
           <p style={{alignSelf: 'center', width: '50%'}}> Here you can see all your readers responding on specific lines in your stories. Have 1:1 chat 💬 with them privately 🔒 or make it public below your story 🎙️. Designed to cultivate intimate relationship and convert your Casual Fans 👻 into Super Fans 🦸‍♂️ overtime.</p>
        </div>
        <div className={classes.communityContainer}>
            
            <div className={classes.community}>
                <img src={communityImage} height='550px' width='1110px' />
            </div>
           
        </div>
        <div style={{height: '300px', backgroundColor: '#F6F6F7'}}></div>
        </>
    );
}

const useStyles = makeStyles({
    communityContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 45rem)',
        backgroundColor: '#F6F6F7',
    },

    community: {
        borderRadius: '28px',
        overflow: 'hidden',
        filter: 'blur(5px)',
    },

    communityLine: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        width: '100%',
        // marginTop: '1%',
        textAlign: 'center',
        backgroundColor: '#F6F6F7',
    }
})

export default WriterCommunity;