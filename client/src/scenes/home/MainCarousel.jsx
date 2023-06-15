import { Box, Typography, IconButton, useMediaQuery, Link } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { shades } from "../../theme";
import { useNavigate } from "react-router-dom";

const MainCarousel = (categories) => {
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const navigate = useNavigate()

    return (
        <Carousel
            autoPlay 
            interval="5000"
            infiniteLoop={true}
            showThumbs={false}
            showIndicators={false}
            showStatus={false}
            style={{ borderRadius: "10px", overflow: "hidden" }}
            renderArrowPrev={(onClickHandler, hasPrev, label) => (
                <IconButton
                    onClick={onClickHandler}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "0",
                        color: "white",
                        padding: "5px",
                        zIndex: "10"
                    }}
                >
                    <NavigateBeforeIcon sx={{ fontSize: 40 }} />
                </IconButton>
            )}
            renderArrowNext={(onClickHandler, hasNext, label) => (
                <IconButton
                    onClick={onClickHandler}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        right: "0",
                        color: "white",
                        padding: "5px",
                        zIndex: "10"
                    }}
                >
                    <NavigateNextIcon sx={{ fontSize: 40 }} />
                </IconButton>
            )}
        >
            {categories.categories.map( category => (
                <Box key={`carousel-image-${category.id}`} sx={{display: "block"}}>
                    <Link href={`/category/${category.id}`}>
                        <Box>
                            <img
                                src={`http://127.0.0.1:8000/${category.hero}`}
                                alt={`carousel-${category.id}`}
                                style={{
                                    width: "100%",
                                    height: "500px",
                                    objectFit: "cover",
                                    backgroundAttachment: "fixed",
                                    borderRadius: "10px",
                                    filter: "brightness(70%)"
                                }}
                            />
                        </Box>
                        <Box
                            color="white"
                            padding="20px"
                            borderRadius="1px"
                            textAlign="left"
                            backgroundColor="rgb(0, 0, 0, 0.8)"
                            position="absolute"
                            top="46%"
                            left={isNonMobile ? "10%" : "0"}
                            right={isNonMobile ? undefined : "0"}
                            margin={isNonMobile ? undefined : "0 auto"}
                            maxWidth={isNonMobile ? undefined : "240px"}
                        >
                            <Typography variant="h1">{category.name}</Typography>
                        </Box>
                    </Link>
                </Box>
            ))}
        </Carousel>
    )
}

export default MainCarousel;