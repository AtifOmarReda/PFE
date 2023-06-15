import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Tab, Tabs, useMediaQuery, Paper } from "@mui/material";
import Item from "../../components/Item";
import { setItems }from "../../state";
import { shades } from "../../theme";

const Category = () => {
    
    const dispatch = useDispatch();
    const categoryId = useParams();
    const [items, setItems] = useState(null)
    const [category, setCategory] = useState(null);
    const [isLoadingItem, setIsLoadingItem] = useState(true);
    const [isLoadingCategory, setIsLoadingCategory] = useState(true);
    const isNonMobile = useMediaQuery("(min-width:600px)");

    let getItems = async () => {
        let response = await fetch(`http://127.0.0.1:8000/api/item?category_id=${categoryId.categoryId}`, { method: 'GET' })
        let itemsJson = await response.json()
        setItems(itemsJson)  
        setIsLoadingItem(false)
    }

    let getCategory = async () => {
        let response = await fetch(`http://127.0.0.1:8000/api/category?category_id=${categoryId.categoryId}`, { method: 'GET' })
        let categoryJson = await response.json()
        setCategory(categoryJson)
        setIsLoadingCategory(false)
    }

    useEffect(() => {
        getCategory();
        getItems();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if(isLoadingItem || isLoadingCategory) return null;

    return (
        <Box 
            margin="15px"
            marginTop="80px"
        >
            <Box height="500px">
                <img 
                    src={`http://127.0.0.1:8000/${category[0].hero}`}
                    alt={`carousel-${category[0].id}`}
                    style={{
                        width: "100%",
                        height: "500px",
                        objectFit: "cover",
                        backgroundAttachment: "fixed",
                        borderRadius: "10px",
                        filter: "brightness(70%)"
                    }}
                />
                <Box
                    color="white"
                    padding="20px"
                    borderRadius="1px"
                    textAlign="left"
                    backgroundColor="rgb(0, 0, 0, 0.8)"
                    position="absolute"
                    top="42%"
                    left={isNonMobile ? "38%" : "0"}
                    right={isNonMobile ? undefined : "0"}
                    margin={isNonMobile ? undefined : "0 auto"}
                    maxWidth={isNonMobile ? undefined : "480px"}
                >
                <Typography variant="h2">{category[0].name}</Typography>
                </Box>
            </Box>
            <Box width="80%" margin="20px auto">
                <Typography variant="h3" textAlign="center">
                    <b>Produits</b>
                </Typography>
                <Box
                    margin="0 auto"
                    display="grid"
                    gridTemplateColumns="repeat(auto-fill, 300px)"
                    justifyContent="space-around"
                    rowGap="20px"
                    columnGap="1.33%"
                >
                    {items.map((item) => (
                        <Item item={item} key={`${item.name}-${item.id}`} />
                    ))}
                </Box>
            </Box>
        </Box>
    )
}
export default Category;