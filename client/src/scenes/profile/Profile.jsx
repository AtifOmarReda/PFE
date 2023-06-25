import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, useMediaQuery } from "@mui/material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
import AuthContext from "../../context/AuthContext";

const Profile = () => {

    const navigate = useNavigate()
    const { authTokens, logoutUser } = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true)

    let updateUser = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/user/profile/', {
                method: 'GET',
                headers: {
                    'Authorization': `JWT ${authTokens.access}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                const profileData = await response.json();
                setUser(profileData)
            } else logoutUser()

            setLoadingUser(false)

        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    useEffect(() => {
        updateUser()
    }, [])

    const isNonMobile = useMediaQuery("(min-width: 600px)");

    if(loadingUser) return null

    return (
        <Box marginTop="90px" textAlign="center">
            <Typography variant="h3" marginBottom="20px" >Espace utilisateur</Typography><br></br>
            <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, 500px)"
                justifyContent="space-around"
                rowGap="20px"
                columnGap="50px"
                margin="auto"
                width="80%"
                textAlign="center"
            >   
                <Box 
                    boxShadow="2" 
                    sx={{ 
                        maxHeight: "500px", 
                        overflow: "auto",
                        padding: "20px",
                        backgroundColor: "rgb(0, 0, 0, 0.01)"
                    }}
                > 
                    <Typography variant="h3" marginBottom="20px" >Profile</Typography>
                    <ManageAccountsIcon sx={{fontSize: "200px"}}/><br></br>
                    <Button 
                        variant="contained"                             
                        sx={{
                            backgroundColor: "#222222",
                            color: "white",
                            borderRadius: 0,
                            padding: "10px 40px"
                        }}
                        onClick={() => navigate("./update-profile")}
                    >Paramètres de profil</Button>
                </Box>
                <Box 
                    boxShadow="3" 
                    sx={{ 
                        maxHeight: "500px", 
                        overflow: "auto",
                        padding: "20px",
                        backgroundColor: "rgb(0, 0, 0, 0.01)"
                        }}
                >
                    <Typography variant="h3" marginBottom="20px">Commandes</Typography>
                    <ShoppingCartCheckoutIcon sx={{fontSize: "200px"}}/><br></br>
                    <Button 
                        variant="contained"                             
                        sx={{
                            backgroundColor: "#222222",
                            color: "white",
                            borderRadius: 0,
                            padding: "10px 40px"
                        }}
                        onClick={() => navigate("./orders")}
                    >Liste des commandes</Button>
                </Box>
                {user.role == 'administrator' &&
                    <Box 
                        boxShadow="3" 
                        sx={{ 
                            maxHeight: "500px", 
                            overflow: "auto",
                            padding: "20px",
                            backgroundColor: "rgb(0, 0, 0, 0.01)"
                            }}
                    >
                        <Typography variant="h3" marginBottom="20px">Utilisateurs</Typography>
                        <AccountCircleIcon sx={{fontSize: "200px"}}/><br></br>
                        <Button 
                            variant="contained"                             
                            sx={{
                                backgroundColor: "#222222",
                                color: "white",
                                borderRadius: 0,
                                padding: "10px 40px"
                            }}
                            onClick={() => navigate("./users")}
                        >Liste des utilisateurs</Button>
                    </Box>
                }
                {user.role == 'vendor' &&
                    <Box 
                        boxShadow="3" 
                        sx={{ 
                            maxHeight: "500px", 
                            overflow: "auto",
                            padding: "20px",
                            backgroundColor: "rgb(0, 0, 0, 0.01)"
                            }}
                    >
                        <Typography variant="h3" marginBottom="20px">Produits</Typography>
                        <InventoryIcon sx={{fontSize: "200px"}}/><br></br>
                        <Button 
                            variant="contained"                             
                            sx={{
                                backgroundColor: "#222222",
                                color: "white",
                                borderRadius: 0,
                                padding: "10px 40px"
                            }}
                            onClick={() => navigate("./items")}
                        >Liste des produits</Button>
                    </Box>
                }
            </Box>
        </Box>
    )
}

export default Profile;