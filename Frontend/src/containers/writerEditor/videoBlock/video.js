import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';

const Video = ({ onDataChange, data, readOnly }) => {
    const [search, setSearch] = useState(null);
    const [submited, setSubmited] = useState(false);
    const [placeholder, setPlaceholder] = useState('Enter Youtube or Vimeo URL');
    const [error, setError] = useState(false);
    const [isYouTube, setIsYouTube] = useState(false);
    const [youTubeEmbed, setYouTubeEmbed] = useState('');
    const [isVimeo, setIsVimeo] = useState(false);
    const [vimeoEmbed, setVimeoEmbed] = useState('');
    const classes = useStyles();
    const handleEnter = () => {
        if (isValidSpotifyURL(search) === 'youtube') {
            setSubmited(true);
            onDataChange(search);
            setIsYouTube(true);
            setIsVimeo(false);
            setPlaceholder('Enter Youtube or Vimeo URL');
            setYouTubeEmbed(search.slice(search.search('be') + 3, search.length));
            setVimeoEmbed('');
            setError(false);
        } else if (isValidSpotifyURL(search) === 'vimeo') {
            setSubmited(true);
            onDataChange(search);
            setIsVimeo(true);
            setIsYouTube(false);
            setVimeoEmbed(search.slice(search.search('om/') + 3, search.length));
            setYouTubeEmbed('');
            setPlaceholder('Enter Youtube or Vimeo URL');
            setError(false);
        }
            else {
            setPlaceholder('Please enter correct Youtube/Vimeo URL');
            setError(true);
        }
    }
    useEffect(() => {
        const check = isValidSpotifyURL(data?.url);
        if (check === 'youtube') {
            setIsYouTube(true);
            setYouTubeEmbed(data?.url.slice(data?.url.search('be') + 3, data?.url.length));
        } else if (check === 'vimeo') {
            setIsVimeo(true);
            setVimeoEmbed(data?.url.slice(data?.url.search('om/') + 3, data?.url.length));
        } else {
            setIsYouTube(false);
            setIsVimeo(false);
            setYouTubeEmbed('');
            setVimeoEmbed('');
        }
    }, []);

    const isValidSpotifyURL = (url) => {
        const youtube = /(?:https?:\/\/)?(?:www\.)?(?:(?:youtu\.be\/)|(?:youtube\.com)\/(?:v\/|u\/\w\/|embed\/|watch))(?:(?:\?v=)?([^#&?=]*))?((?:[?&]\w*=\w*)*)/;
        const vimeo = /(?:http[s]?:\/\/)?(?:www.)?(?:player.)?vimeo\.co(?:.+\/([^\/]\d+)(?:#t=[\d]+)?s?$)/;
        if (youtube.test(url)) {
            return 'youtube';
        } else if (vimeo.test(url)) {
            return 'vimeo';
        }
        return 'not found';
    }

    const youtubeLink = youTubeEmbed.split('?')[1]?.substring(2)

    if(!data.url && readOnly){
        return <></>
    }
    

    return (
        <div className={classes.spotifyEmbed}>
            {!submited && data.url === "" ? (
                <div>
                    <TextField
                        variant="standard"
                        fullWidth
                        label={placeholder}
                        error={error}
                        onKeyDown={(e) => {
                            if (e.keyCode == 13) {
                                handleEnter();
                            }
                        }
                        }
                        onChange={(e) => {
                            // setUrl(search);
                            setSearch(e.target.value)
                        }}
                        id="he"
                    />
                    {/* <Button onClick={handleEnter}>Search</Button> */}
                </div>) : (
                <div>
                    {isYouTube && < div >
                        <iframe width="100%" height="315" src={`https://www.youtube.com/embed/${youtubeLink}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        {/* <iframe src="https://open.spotify.com/embed/episode/1mWmPaLDeCZAtQwPmjwB1k?utm_source=generator" width="100%" height="232" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe> */}
                    </div>}
                    {isVimeo &&< div >
                        <iframe src={`https://player.vimeo.com/video/${vimeoEmbed}`} width="100%" height="360" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
                        {/* <iframe src="https://open.spotify.com/embed/episode/1mWmPaLDeCZAtQwPmjwB1k?utm_source=generator" width="100%" height="232" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe> */}
                    </div>}
                </div>
            )
            }
        </div >
    );
}
const useStyles = makeStyles({
    spotifyEmbed: {
        marginBottom: '3%',
        paddingTop: '2%',
    }
})

export default Video;