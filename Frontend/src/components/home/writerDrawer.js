import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import userPhoto from './../../Images/userPhoto.jpg';
import userImage from './../../Images/user-image.png';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        "& .MuiDrawer-paper": {
            // width: 200,
            // position: "absolute",
            // height: 100,
            // transition: "none !important"
        },
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function MiniDrawer() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawer = () => {
        if (open) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* <AppBar position="fixed" open={open} style={{
                background: 'transparent',
                boxShadow: 'none',
                borderRadius: '0px',
                '&:hover': {
                    backgroundColor: 'transparent',
                    background: 'transparent',
                },
            }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{
                        marginRight: '36px',
                        ...(open && { display: 'none' }),
                    }}
                >
                    <MenuIcon />
                </IconButton>
            </AppBar> */}
            <Drawer variant="permanent" open={open} classes={{ paper: classes.dialogPaper }}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawer}>
                        {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {['Jack Level', 'Reiner Diesel', 'Erer Yearger', 'Mikasa Ackerman'].map((text, index) => (
                        <ListItem button key={text}>
                            <div className={classes.writersWithCardsProfile}>
                                <div>
                                    <div className={classes.writersWithCardsProfileImageContainer}>
                                        {index % 2 == 0 ? <img src={userPhoto} className={classes.writersWithCardsProfileImage} /> :
                                            <img src={userImage} className={classes.writersWithCardsProfileImage} />}
                                    </div>
                                    {!open && <div className={classes.smallName}>{text.slice(0, text.search(' '))}</div>}
                                </div>
                                {open && <div className={classes.writersWithCardsProfileName}>{text}</div>}
                            </div>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
}

const useStyles = makeStyles(theme => ({
    dialogPaper: {

        height: '400px', width: '5px',
    },

    writersWithCardsProfile: {
        display: 'flex',
        alignItems: 'center',
        padding: '4%',
    },

    writersWithCardsProfileImageContainer: {
        minWidth: '45px',
        maxHeight: '45px',
        minWidth: '45px',
        maxHeight: '45px',
        borderRadius: '50%',
        overflow: 'hidden',
    },

    writersWithCardsProfileImage: {
        minWidth: '45px',
        maxWidth: '45px',
        minHeight: '45px',
        maxHeight: '45px',
        objectFit: 'cover',
    },

    writersWithCardsProfileName: {
        fontSize: '0.9rem',
        paddingLeft: '10%',
        color: 'rgba(99, 99, 99, 1)',
        fontWeight: '600',
        fontFamily: 'Poppins',
    },

    smallName: {
        fontSize: '0.7em',
        maxWidth: '45px',
        textAlign: 'center',
        fontFamily: 'Poppins',
        fontWeight: '600',
    },
}));