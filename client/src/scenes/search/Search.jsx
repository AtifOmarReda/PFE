import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Tab, Tabs, useMediaQuery } from "@mui/material";
import Item from "../../components/Item";
import { setItems }from "../../state";
import { useParams } from 'react-router-dom';

const Search = () => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const query = useParams()

    let getItems = async () => {
        let response = await fetch(`http://127.0.0.1:8000/api/search-item?query=${query.query}`, { method: 'GET' })
        let itemsJson = await response.json()
        setItems(itemsJson)
        setLoading(false)
    }

    useEffect(() => {
        getItems();
    }, [query]) 

    if(loading) return null

    return (
        <Box width="80%" margin="80px auto">
            <Typography variant="h3" textAlign="center">
                <b> {items.length > 0 ? `Produits après recherche de ${query.query}` : "Aucun produit trouvé!"}</b>
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
    )
}

export default Search;