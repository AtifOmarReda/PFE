import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Searchbar = () => {
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate()
  
    const handleSearch = (event) => {
        event.preventDefault();
        navigate(`/search/${searchValue}`)
    };
  
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch(event);
        }
    };
  
    const handleChange = (event) => {
      setSearchValue(event.target.value);
    };
  
    return (
        <form onSubmit={handleSearch}>
            <TextField
                placeholder="Rechercher un produit."
                variant="outlined"
                fullWidth
                value={searchValue}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton type="submit">
                        <SearchOutlined />
                        </IconButton>
                    </InputAdornment>
                    ),
                    sx: {
                        borderRadius: "9999px",
                        height: "40px",
                        overflow: "hidden",
                        marginLeft: "20px",
                        boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.23) inset",
                        "&:hover": {
                            boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.87) inset",
                        },
                        width: "70%",
                        left: "15%",
                    },
                    inputProps: {
                        style: {
                            paddingLeft: "25px",
                        },
                    },
                }}
            />
        </form>
        );
    };

export default Searchbar;