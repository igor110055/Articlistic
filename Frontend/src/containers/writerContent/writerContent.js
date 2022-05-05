import { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { userUsername } from "../user/userActions";
import WriterDashboard from "./writerDahsboard";
import WriterCommunity from "./writerCommunity";
import { useNavigate } from 'react-router-dom';
import WriterStories from "./writerStories";
import WriterPublication from "./writerPublication";
import { getPublications } from "./writerActions";
import { getAuthToken } from "../common/commonFunctions";


const WriterContent = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [myStoryClass, setMyStoryClass] = useState(``);
    const [dashboardClass, setDashboardClass] = useState(`${classes.saveBarLeftSelected}`);
    const [communityClass, setCommunityClass] = useState(``);
    const [publicationClass, setPublicationClass] = useState(``)

  /**
   * The function is called when the user clicks on the My Stories button. 
   * 
   * The function sets the class of the My Stories button to the selected class. 
   */
    const handleClickMyStories = () => {
        setMyStoryClass(`${classes.saveBarLeftSelected}`);
        setDashboardClass('');
        setCommunityClass('');
        setPublicationClass('')
    }
    const handleClickDashboard = () => {
        setDashboardClass(`${classes.saveBarLeftSelected}`);
        setMyStoryClass(``);
        setCommunityClass('');
        setPublicationClass('')
    }
    const handleClickCommunity = () => {
        setCommunityClass(`${classes.saveBarLeftSelected}`);
        setDashboardClass(``);
        setMyStoryClass(``);
        setPublicationClass('')
    }
    
    const handleClickPublication = () => {
        setPublicationClass(`${classes.saveBarLeftSelected}`);
        setDashboardClass(``);
        setMyStoryClass(``);
        setCommunityClass('')
    }

    const {
        isUploadingArticle,
        uploadArticleError,
        publicationsData,
        uploadArticleResp,
    } = useSelector((state) => ({
        isUploadingArticle: state.writerEditor.isUploadingArticle,
        uploadArticleError: state.writerEditor.uploadArticleError,
        publicationsData: state.writerContent.publicationsData,
        uploadArticleResp: state.writerEditor.uploadArticleResp,
    }));
    
    const dispatch = useDispatch();

/* Used to clear the local storage when the user navigates to the story page. */
    useEffect(() => {
        if (localStorage.getItem('articleId')) {
            localStorage.removeItem('article');
            localStorage.removeItem('articlePic');
        }
        dispatch(userUsername(JSON.parse(localStorage.getItem('user'))?.userUserName));
        const token = getAuthToken();
        dispatch(
            getPublications({
              token,
              userUserName: JSON.parse(localStorage.getItem('user'))?.userUserName,
            })
          );
    }, []);


    /**
     * * If there are no publications, create one.
     * * Otherwise, navigate to the story page
     * @returns The `handleCreateArticle` function is being returned.
     */
    const handleCreateArticle = () => { 
        localStorage.removeItem('articleId');
        if(publicationsData.length === 0) {
          handleClickPublication()
          return   
        }
        navigate('/story');
    }

    return (
        <div>
            <div className={classes.saveBar}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ color: 'rgba(255, 167, 0, 1)', fontWeight: '600', fontSize: '1.6em', width: '21rem', paddingLeft: '2%' }}>Writing Studio</div>
                    <div className={classes.saveBarLeft}>
                        <div style={{ color: 'rgba(99, 99, 99, 1)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', padding: '1.2% 0% 1.2% 0%', width: '9.125em', textAlignLast: 'center' }} className={dashboardClass} onClick={handleClickDashboard}>Dashboard</div>
                        <div style={{ color: 'rgba(99, 99, 99, 1)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', padding: '1.2% 0% 1.2% 0%', width: '9.125em', textAlignLast: 'center' }} className={myStoryClass} onClick={handleClickMyStories}>My Stories</div>
                        <div style={{ color: 'rgba(99, 99, 99, 1)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', padding: '1.2% 0% 1.2% 0%', width: '9.125em', textAlignLast: 'center' }} className={communityClass} onClick={handleClickCommunity}>
                            Community   
                        </div>
                        <div style={{ color: 'rgba(99, 99, 99, 1)', marginLeft: "14px" ,fontWeight: '600', fontSize: '14px', cursor: 'pointer', padding: '1.2% 0% 1.2% 0%', width: '9.125em', textAlignLast: 'center' }} className={publicationClass} onClick={handleClickPublication}>
                            My Publications   
                        </div>
                    </div>
                  
                </div>
                <div className={classes.saveBarRight}>
                    <Button
                        sx={{
                            "&.MuiButton-text": { color: "white" },
                            fontFamily: "Poppins",
                            fontSize: "0.8em",
                            textTransform: "capitalize",
                            borderRadius: '10px',
                            background: 'linear-gradient(136.99deg, #FFA700 10.01%, #FF6D00 81.93%)',
                        }}
                        style={{ marginRight: '1rem', width: '10rem', height: '34px' }}
                        disabled={isUploadingArticle}
                        onClick={handleCreateArticle}
                    >
                        {isUploadingArticle ? <CircularProgress size={20} style={{ color: 'white' }} /> : <h3>Create Story</h3>}
                    </Button>
                </div>
            </div>
            <div>
                {dashboardClass !== '' && < WriterDashboard />}
                {communityClass !== '' && < WriterCommunity />}
                {myStoryClass !== '' && <WriterStories />}
                {publicationClass !== '' && <WriterPublication />}
            </div>
        </div>
    );
}

const useStyles = makeStyles({
    saveBar: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alginItems: 'center',
        boxShadow: '0px 2px 24px rgba(199, 212, 223, 0.37612)',
        padding: '0.3% 0% 0.3% 0%',
        height: '3rem',
        backgroundColor: 'white',
        zIndex: 1,
    },

    saveBaricon: {
        width: '40px',
        marginLeft: '1%',
    },

    saveBarLeft: {
        display: 'flex',
        width: '60%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: '1%',
    },

    saveBarLeftSelected: {
        border: '1px solid rgba(151, 151, 151, 0.3)',
        borderRadius: '10px',
    },

    saveBarRight: {
        display: 'flex',
        alignItems: 'center',
    },
})

export default WriterContent;