import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, List, ListItem } from '@mui/material';
import AuthContext from "../../context/AuthContext";
import {shades} from "../../theme"

const Users = () => {

    const navigate = useNavigate()
    const [isLoading, setIsloading] = useState(true)
    const [users, setUsers] = useState(null)
    const [vendors, setVendors] = useState([])
    const [active, setActive] = useState([]);
    const { authTokens } = useContext(AuthContext)
 
    const getUsers = async () => {
        try{
            const response = await fetch("http://127.0.0.1:8000/api/get-users/", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT ' + String(authTokens.access)
                }
            })
            const data = await response.json()
            if(response.ok) {
                setUsers(data)
                setIsloading(false)
            } else {
                alert("An Error has occured")
            }
        } catch(error) {
            alert("An error has occured!")
            console.error(error)
        }
    }

    const modifyVendor = async (userId) => {
        try{
            const response = await fetch("http://127.0.0.1:8000/api/vendor/", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT ' + String(authTokens.access)
                },
                body: JSON.stringify({user_id: userId})
            })
            const data = await response.json()
            if(!response.ok) {
                alert("An Error has occured")
            }
        } catch(error) {
            alert("An error has occured!")
            console.error(error)
        }
    }

    const modifyActive = async (userId) => {
        try{
            const response = await fetch("http://127.0.0.1:8000/api/active/", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT ' + String(authTokens.access)
                },
                body: JSON.stringify({user_id: userId})
            })
            const data = await response.json()
            if(!response.ok) {
                alert("Une erreur est survenue!")
            }
        } catch(error) {
            alert("Une erreur est survenue!")
            console.error(error)
        }
    }

    useEffect(() => {
        getUsers();
    }, [])

    useEffect(() => {
        if (users) {
            const updatedVendors = users.map(user => {
            return {
                id: user.id,
                isVendor: user.role === 'vendor'
                };
            });
            setVendors(updatedVendors);
        }
    }, [users]);

    useEffect(() => {
        if (users) {
          const updatedActive = users.map(user => {
            return {
              id: user.id,
              isActive: user.is_active === true
            };
          });
          setActive(updatedActive);
        }
      }, [users]);

    const handleVendorToggle = (userId) => {
        modifyVendor(userId)
        setVendors(prevVendors => {
            return prevVendors.map(vendor => {
                if (vendor.id === userId) {
                    return {
                        id: vendor.id,
                        isVendor: !vendor.isVendor
                    };
                }
                return vendor;
            });
        });
    };

    const handleActiveToggle = (userId) => {
        modifyActive(userId)
        setActive(prevActive => {
            return prevActive.map(user => {
                if (user.id === userId) {
                    return {
                        id: user.id,
                        isActive: !user.isActive
                    };
                }
                return user;
            });
        });
    };

    if(isLoading) return null

    return (
        <Box display="flex" justifyContent="center" width="80%" margin="90px auto 0 auto" left="10%">
             <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>E-mail</TableCell>
                            <TableCell>Vendeur</TableCell>
                            <TableCell>Bloqué</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                {vendors.find(vendor => vendor.id === user.id)?.isVendor ? (
                                    <Button 
                                        variant="contained"                             
                                        sx={{
                                            backgroundColor: "#222222",
                                            color: "white",
                                            borderRadius: 0,
                                            padding: "10px 40px"
                                        }}
                                        onClick={() => handleVendorToggle(user.id)}
                                    >Supprimer vendeur</Button>
                                ) : (
                                    <Button 
                                        variant="contained"                             
                                        sx={{
                                            backgroundColor: "#222222",
                                            color: "white",
                                            borderRadius: 0,
                                            padding: "10px 40px"
                                        }}
                                        onClick={() => handleVendorToggle(user.id)}
                                    >Ajouter vendeur</Button>
                                )}
                            </TableCell>
                            <TableCell>
                                {active.find(activeUser => activeUser.id === user.id)?.isActive ? (
                                    <Button 
                                        variant="contained"                             
                                        sx={{
                                            backgroundColor: "#222222",
                                            color: "white",
                                            borderRadius: 0,
                                            padding: "10px 40px"
                                        }} 
                                        onClick={() => handleActiveToggle(user.id)}
                                    >Bloquer utilisateur</Button>
                                ) : (
                                    <Button 
                                        variant="contained"                             
                                        sx={{
                                            backgroundColor: "#222222",
                                            color: "white",
                                            borderRadius: 0,
                                            padding: "10px 40px"
                                        }} 
                                        onClick={() => handleActiveToggle(user.id)}
                                    >Debloquer utilisateur</Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default Users;