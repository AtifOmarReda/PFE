import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Tab, Tabs, useMediaQuery } from "@mui/material";
import Item from "../../components/Item";
import { setItems }from "../../state";

const ShoppingList = () => {
    const dispatch = useDispatch();
    const [value, setValue] = useState("newArrivals");
    const items = useSelector((state) => state.cart.items);
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let getItems = async () => {
        let response = await fetch(`http://127.0.0.1:8000/api/item/`, { method: 'GET' })
        let itemsJson = await response.json()
        dispatch(setItems(itemsJson))
    }

    useEffect(() => {
        getItems();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const topRatedItems = items.filter(
        (item) => item.mainCategory === "topRated"
    );
    const newArrivalsItems = items.filter(
        (item) => item.mainCategory === "newArrivals"
    );
    const bestSellersItems = items.filter(
        (item) => item.mainCategory === "bestSellers"
    );

    return (
        <Box width="80%" margin="80px auto">
            <Typography variant="h3" textAlign="center">
                Nos <b>produits</b>
             </Typography>
            <Tabs
                textColor='primary'
                indicatorColor='primary'
                value={value}
                onChange={handleChange}
                centered
                TabIndicatorProps={{ sx: { display: isNonMobile ? "block" : "none"} }}
                sx={{
                    m: "25px",
                    "& .MuiTabs-flexContainer": {
                        flexWrap: "wrap"
                    }
                }}
            >
                <Tab label="Nouveautés" value="newArrivals" />
                <Tab label="Meilleures ventes" value="bestSellers" />
                <Tab label="Les mieux notés" value="topRated" />
            </Tabs>
            <Box
                margin="0 auto"
                display="grid"
                gridTemplateColumns="repeat(auto-fill, 300px)"
                justifyContent="space-around"
                rowGap="20px"
                columnGap="1.33%"
            >
                {value === "newArrivals" && newArrivalsItems.map((item) => (
                    <Item item={item} key={`${item.name}-${item.id}`} />
                ))}
                {value === "bestSellers" && bestSellersItems.map((item) => (
                    <Item item={item} key={`${item.name}-${item.id}`} />
                ))}
                {value === "topRated" && topRatedItems.map((item) => (
                    <Item item={item} key={`${item.name}-${item.id}`} />
                ))}
            </Box>
        </Box>
    )
}

export default ShoppingList;