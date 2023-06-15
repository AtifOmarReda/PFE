import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import MainCarousel from "./MainCarousel";
import Categories from "./Categories";

const Hero = () => {
    
    const isNonMobile = useMediaQuery("(min-width: 600px)");

    const [isLoading, setIsLoading] = useState(true)
    const [categories, setCategories] = useState(null)

    const getCategories = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/category/', {method: "GET"})
        const categoryJson = await response.json()
        setCategories(categoryJson)
        setIsLoading(false)
    }
    
    useEffect(() => {
        getCategories();
    }, [])

    if(isLoading) return null

    return (
        <Box
            display="flex"
            margin="15px"
            marginTop="90px"
            justifyContent="space-around"
            columnGap="15px"
        >   
            {isNonMobile && <Box flex="1 1 30%"> 
                <Categories categories={categories}/>
            </Box>}
            <Box 
                flex={isNonMobile ? "1 1 70%" : undefined}
            >
                <MainCarousel categories={categories}/>
            </Box>
        </Box>
    )
}

export default Hero;