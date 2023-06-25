import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Box, Typography, Button, Tabs, Tab } from "@mui/material";
import FavoriteBorderOutlineIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from "@mui/icons-material/Remove";
import { shades } from "../../theme";
import { addToCart, addToFavorites, removeFromFavorites } from "../../state";
import { useNavigate, useParams } from "react-router-dom";
import Item from "../../components/Item";
import AuthContext from "../../context/AuthContext";

const ItemDetails = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const itemId = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [count, setCount] = useState(1)
    const [item, setItem] = useState(null)
    const [items, setItems] = useState([])
    const favorites = useSelector((state) => state.favorites.favoriteItems)
    const loadingFavorites = useSelector((state => state.favorites.loading))
    const [removeFavorite, setRemoveFavorite] = useState(false)
    const { authTokens, logoutUser } = useContext(AuthContext)

    const checkFavorite = async () => {
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
            } else if(response.status == 400){
                alert("L'élément n'existe pas dans le backend")
            }else if(response.status == 201) setRemoveFavorite(true)
            else if(response.status == 200) setRemoveFavorite(false)
        } catch(error) {
            alert("Une erreur est survenue!")
            console.error(error)
        }
    }

    const getItem = async () => {
        const response = await fetch(`http://localhost:8000/api/item?item_id=${itemId.itemId}`);
        const itemJson = await response.json();
        setItem(itemJson);
        setRemoveFavorite(false)
        setIsLoading(false);
    }

    const getItems = async (categoryId) => {
        const response = await fetch(
            `http://127.0.0.1:8000/api/item?category_id=${categoryId}`,
            { method: 'GET' }
        );
        const itemsJson = await response.json();
        const updatedItems = itemsJson.filter((existingItem) => existingItem.id !== item[0].id);
        setItems(updatedItems)
    }

    useEffect(() => {
        getItem();
    }, [itemId]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if(item) {
            getItems(item[0].category.id);
        }
    }, [item])

    useEffect(() => {
        if (item && !loadingFavorites){
            setRemoveFavorite(false)
            for(let i = 0;i<favorites.length;i++){
                if(favorites[i].id == item[0].id) setRemoveFavorite(true)
            }
        }
    }, [item, loadingFavorites, favorites])

    if(isLoading || loadingFavorites){
        return null
    }
    
    return (
        <Box width="80%" m="80px auto">
            <Box display="flex" flexWrap="wrap" columnGap="40px">
                <Box flex="1 1 40%" mb="40px">
                    <img 
                        alt={item[0]?.name}
                        width="100%"
                        height="100%"
                        src={`http://localhost:8000/${item[0]?.image}`}
                        style={{ objectFit: "contain" }}
                    />
                </Box>

                <Box flex="1 1 50%" mb="40px">
                    <Box display="flex" justifyContent="space-between">
                        <Box>{item[0].category.name} / Produit</Box>
                    </Box>
                    <Box m="65px 0 25px 0">
                        <Typography variant="h3"><strong>{item[0].name}</strong></Typography><br/>
                        <Typography variant="h3">{item[0].price} DA</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" minHeight="50px">
                        <Box 
                            display="flex" 
                            alignItems="center" 
                            minHeight="50px" 
                            border={`1.5px solid ${shades.neutral[300]}`} 
                            mr="20px" 
                            p='2px 5px'
                        >
                            <IconButton
                                onClick={() => setCount(Math.max(count -1, 1))}
                            >
                                <RemoveIcon />
                            </IconButton>
                            <Typography sx={{ p: "0 5px"}}>
                                {count}
                            </Typography>
                            <IconButton
                                onClick={() => setCount(Math.max(count + 1))}
                            >
                                <AddIcon />
                            </IconButton>

                        </Box>

                        <Button
                            sx={{
                                backgroundColor: "#222222",
                                color: "white",
                                borderRadius: 0,
                                minWidth: "150px",
                                padding: "10px 40px"
                            }}
                            onClick={() => dispatch(addToCart({ item: { ...item[0], count } }))}
                        >
                            Ajouter au panier
                        </Button>
                    </Box>

                    <Box>
                        {!removeFavorite &&
                            <Box m="20px 0 5px 0" display="flex">
                                    <FavoriteBorderOutlineIcon />
                                    <Typography 
                                        sx={{ ml: "5px", '&:hover': { cursor: "pointer" }}}
                                        onClick={() => {
                                            if(authTokens) {
                                                dispatch(addToFavorites(item[0]))
                                                checkFavorite()
                                            } else {
                                                alert("Vous devez être connecté pour ajouter aux favoris!")
                                            }
                                        }}
                                    >
                                        AJOUTER AUX FAVORIS
                                    </Typography>
                            </Box>
                        }           
                        {removeFavorite &&
                            <Box m="20px 0 5px 0" display="flex">
                                <BookmarkRemoveIcon />
                                <Typography 
                                    sx={{ ml: "5px", '&:hover': { cursor: "pointer" }}}
                                    onClick={() => {
                                        if(authTokens) {
                                            dispatch(removeFromFavorites(item[0]))
                                            checkFavorite()
                                        }
                                    }}
                                >
                                    RETIRER DES FAVORIS
                                </Typography>
                            </Box>
                        }   
                        <Typography mt="8px">CATEGORIES: {item[0].category.name}</Typography>
                    </Box>
                </Box>                
            </Box>

            <Box mt="50px" width="100%">
                <Typography variant="h3" fontWeight="bold">
                    Produits même catégorie
                </Typography>
                <Box
                    mt="20px"
                    display="flex"
                    flexWrap="wrap"
                    columnGap="1.33%"
                    justifyContent="space-between"
                >
                    {items.slice(0, 3).map((item, i) => (
                        <Item key={`${item.name}-${i}`} item={item} />
                    ))}
                </Box>
            </Box>
        </Box>    
    )
}

export default ItemDetails;