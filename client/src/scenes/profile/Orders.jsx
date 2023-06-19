import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, List, ListItem } from '@mui/material';
import AuthContext from "../../context/AuthContext";
import {shades} from "../../theme"

const Orders = () => {

    const navigate = useNavigate()
    const [isLoading, setIsloading] = useState(true)
    const [orders, setOrders] = useState(null)
    const { authTokens } = useContext(AuthContext)

    const cancelOrder = async (orderId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}/cancel/`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT ' + String(authTokens.access)
                }
            });
    
            if (response.ok) {
                getOrders();
            } else {
                alert("Une erreur s'est produite lors de l'annulation d'une commande.");
            }
            } catch (error) {
                alert("Une erreur s'est produite lors de l'annulation d'une commande.");
                console.error(error);
            }
    };
 
    const getOrders = async () => {
        try{
            const response = await fetch("http://127.0.0.1:8000/api/get-orders/", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT ' + String(authTokens.access)
                }
            })
            const data = await response.json()
            if(response.ok) {
                setOrders(data)
                setIsloading(false)
            } else {
                alert("Une erreur est survenue!")
            }
        } catch(error) {
            alert("Une erreur est survenue!")
            console.error(error)
        }
    }

    const handleCancelOrder = (orderId) => {
        cancelOrder(orderId)
    }

    useEffect(() => {
        getOrders();
    }, [])

    if(isLoading) return null

    return (
        <Box display="flex" justifyContent="center" width="80%" margin="90px auto 0 auto" left="10%">
             <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>Utilisateur</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Produits</TableCell>
                        <TableCell>Annulé</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.client}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>
                                <List>
                                {order.order_items.map((item, index) => (
                                    <ListItem key={index}>
                                        <Typography variant="h4">{item.name} {`x${item.quantity}`}</Typography>
                                    </ListItem>
                                ))}
                                </List>
                            </TableCell>
                            <TableCell>
                                {order.cancelled 
                                ? 'Oui' 
                                :   <Button 
                                        variant="contained"                             
                                        sx={{
                                            backgroundColor: "#222222",
                                            color: "white",
                                            borderRadius: 0,
                                            padding: "10px 40px"
                                        }}
                                        onClick={() => handleCancelOrder(order.id)}
                                    >Annuler commande</Button>
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default Orders;