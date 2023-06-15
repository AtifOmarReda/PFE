import { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Box, Icon, Button, IconButton, useMediaQuery, Popover, Modal, Tabs, Tab } from '@mui/material';
import {
    PersonOutline,
    ShoppingCartOutlined,
    SearchOutlined,
    FavoriteBorderOutlined,
    Logout
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { shades } from "../../theme";
import { setIsCartOpen, toggleFavoriteOpen } from '../../state';
import Searchbar from './Searchbar';
import Signup from './Signup';
import Login from './Login';
import api from '../../api/api';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cart);
    const isFavoriteOpen = useSelector((state) => state.favorites.isFavoriteOpen)
    const isNonTablet = useMediaQuery("(min-width: 960px)");
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("signup");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if(isNonTablet) {
            setIsSearchBarOpen(false);
        }
    }, [isNonTablet]);

    let {authTokens, logoutUser, loginUser} = useContext(AuthContext)
    
    useEffect(() => {
        if(authTokens) setIsLoggedIn(true);
        else setIsLoggedIn(false);
    }, []);

    const updateIsLoggedIn = () => {
        setOpen(false);
        setIsLoggedIn(true);
    }

    const updateSignedUp = () => {
        setOpen(false);
        console.log(open)
    }

    const handleToggleSearchBar = (event) => {
        setIsSearchBarOpen(!isSearchBarOpen);
        setAnchorEl(event.currentTarget);
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const handleOpen = (value) => {
        setValue(value);
        setOpen(true);
    }

    const handleLogout = () => {
        logoutUser()
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            width="100%"
            height="60px"
            backgroundColor="rgba(255, 255, 255, 0.96)"
            color="black"
            position="fixed"
            borderBottom="1px solid rgba(0, 0, 0, 0.05)"
            top="0"
            left="0"
            zIndex="1"
        >
            <Box
                width="85%"
                margin="auto"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Box 
                    onClick={() => navigate("/")}
                    sx={{ '&:hover': { cursor: "pointer" }, fontSize: "28px"}}
                    color={shades.secondary}
                >MOCHTARAYATI 
                </Box>
                {isNonTablet && (
                    <Box sx={{ 
                        flex: 1,
                        margin: '0 50px'
                    }}
                    >
                        <Searchbar />
                    </Box>
                )}
                {isSearchBarOpen && (
                    <Popover
                        open={isSearchBarOpen}
                        anchorEl={anchorEl}
                        onClose={() => setIsSearchBarOpen(false)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        PaperProps={{
                            sx: {
                              width: '400px',
                              padding: '10px 40px 10px 0',
                              marginLeft: '-100px',
                              marginTop: '8px',
                            },
                        }}
                    >
                        <Searchbar />
                    </Popover>
                )}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    columnGap="20px"
                    zIndex="2"
                >
                    {!isNonTablet &&
                        <IconButton sx={{ color: "black", scale: "1.2" }} onClick={handleToggleSearchBar}>
                            <SearchOutlined />
                        </IconButton>
                    }
                    {isLoggedIn && 
                        <IconButton sx={{ color: "black", scale: "1.2" }} onClick={() => navigate('/profile')}>
                            <PersonOutline />
                        </IconButton>
                    }

                    {!isLoggedIn && 
                        <Box>
                            <Button
                                variant="outlined"
                                onClick={() => handleOpen('signup')}
                                sx={{
                                    backgroundColor: "white",
                                    color: "black",
                                    marginRight: "5px"
                                }}
                            >Inscrivez-Vous</Button>
                            <Button
                                variant="text"
                                onClick={() => handleOpen('login')}
                                sx={{
                                    backgroundColor: "white",
                                    color: "black",
                                    textDecoration: "underline"
                                }}
                            >Connectez-Vous</Button>
                        </Box>
                    }

                    <Modal 
                        open={open} 
                        onClose={() => setOpen(false)} 
                    >
                        <Box sx={{ 
                            position: 'absolute', 
                            top: '50%', left: '50%', 
                            transform: 'translate(-50%, -50%)',
                            bgcolor: "white",
                            boxShadow: 24,
                            borderRadius: "1%"
                        }}>
                            <Tabs
                                textColor='primary'
                                indicatorColor='primary'
                                value={value}
                                onChange={handleChange}
                                centered
                                sx={{
                                    m: "25px",
                                    "& .MuiTabs-flexContainer": {
                                        flexWrap: "wrap"
                                    }
                                }}
                            >
                                <Tab label="Inscrivez-Vous" value="signup" />
                                <Tab label="Connectez-Vous" value="login" />
                            </Tabs>
                            {value === "signup" && (
                                <Signup updateSignedUp={updateSignedUp}/>
                            )}
                            {value === "login" && (
                                <Login updateIsLoggedIn={updateIsLoggedIn} loginUser={loginUser}/>
                            )}
                        </Box>
                    </Modal>

                    {isLoggedIn &&
                        <IconButton 
                            onClick={() => dispatch(toggleFavoriteOpen({}))}
                            sx={{ color: "black", scale: "1.2" }}
                        >
                            <FavoriteBorderOutlined />
                        </IconButton>
                    }

                    <Badge
                        badgeContent={cart.length}
                        color="secondary"
                        invisible={cart.length === 0}
                        sx={{
                            "& .MuiBadge-badge": {
                                right: 5,
                                top: 5,
                                padding: "0 4px",
                                height: "14px",
                                minWidth: "13px"
                            }
                        }}
                    >
                        <IconButton 
                            onClick={() => dispatch(setIsCartOpen({}))}
                            sx={{ color: "black", scale: "1.2" }}
                            >
                            <ShoppingCartOutlined />
                        </IconButton>
                    </Badge>
                    {isLoggedIn &&
                        <IconButton sx={{ color: "black", scale: "1.2" }} onClick={handleLogout}>
                            <Logout />
                        </IconButton>
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default Navbar;