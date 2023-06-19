import { Box, Button, Divider, IconButton, Typography, Link } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import styled from '@emotion/styled';
import{
    toggleFavoriteOpen,
    fetchFavoriteItems,
    removeFromFavorites
} from "../../state/index";
import { shades } from "../../theme";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";

const FlexBox = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const FavoritesMenu = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isFavoriteOpen = useSelector((state) => state.favorites.isFavoriteOpen)
    const { authTokens, user, logoutUser } = useContext(AuthContext)
    const favorites = useSelector((state) => state.favorites.favoriteItems)
    const loading = useSelector((state) => state.favorites.loading)

    useEffect(() => {
        dispatch(fetchFavoriteItems())
    }, [dispatch, authTokens])

    const removeFavorite = async (itemId) => {
        try{
            const response = await fetch("http://127.0.0.1:8000/api/create-favorite/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT ' + String(authTokens.access)
                },
                body: JSON.stringify(itemId)
            })
            const data = await response.json()
            if(response.status == 401) {
                alert("Une erreur est survenue! Déconnexion maintenant")
                logoutUser()
                navigate("/")
            }
        } catch(error) {
            alert("Une erreur est survenue!")
            console.error(error)
        }
    }

    if(loading) return null
    
    return (
        <Box
            display={isFavoriteOpen ? "block" : "none"}
            backgroundColor="rgba(0, 0, 0, 0.4)"
            position="fixed"
            zIndex="10"
            width="100%"
            height="100%"
            left="0"
            top="0"
            overflow="auto"
        >
            <Box
                position="fixed"
                right="0"
                bottom="0"
                width="max(400px, 30%)"
                height="100%"
                backgroundColor="white"
            >
                <Box padding="30px" overflow="auto" height="100%">
                    <FlexBox mb="15px">
                        <Typography variant="h3">Votre Favoris</Typography>
                        <IconButton onClick={() => dispatch(toggleFavoriteOpen({}))}>
                            <CloseIcon />
                        </IconButton>
                    </FlexBox>

                    <Box>
                        {favorites.map((item) => (
                            <Box key={`${item.name}-${item.id}`}>
                                <Link href={`/item/${item.id}`} style={{ textDecoration: 'none' }}>
                                    <FlexBox p="15px 0">
                                        <Box flex="1 1 40%">
                                            <img
                                                alt={item?.name}
                                                width="123px"
                                                height="123px"
                                                src={`http://localhost:8000${item?.image}`} 
                                            />
                                        </Box>
                                        <Box flex="1 1 60%">
                                            <FlexBox mb="5px">
                                                <Typography fontWeight="bold">
                                                    {item.name}
                                                </Typography>
                                                <IconButton onClick={(event) => {
                                                    event.preventDefault()
                                                    event.stopPropagation()
                                                    dispatch(removeFromFavorites({ id: item.id }))
                                                    removeFavorite({ itemId: item.id }) 
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </FlexBox>
                                            <FlexBox m="15px 0">
                                                <Typography fontWeight="bold">
                                                    {item.price} DA
                                                </Typography>
                                            </FlexBox>
                                        </Box>
                                    </FlexBox>
                                </Link>
                                <Divider />
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default FavoritesMenu;