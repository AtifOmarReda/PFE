import { Box, TextField, InputAdornment } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";

const Searchbar = () => {
    return (
            <TextField
                placeholder="Rechercher un produit."
                variant="outlined"
                fullWidth
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <SearchOutlined />
                    </InputAdornment>
                    ),
                    sx: {
                        borderRadius: "9999px",
                        height: "40px",
                        overflow: "hidden",
                        marginLeft: "20px",
                        boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.23) inset",
                        '&:hover': {
                            boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.87) inset",
                        },
                        width: '70%',
                        left: '15%',
                    },
                }}
            />
    );
}

export default Searchbar;