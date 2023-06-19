import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';
import AuthContext from "../../context/AuthContext";
import { shades } from "../../theme";

const Items = () => {
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(true);
  const [items, setItems] = useState(null);
  const { authTokens } = useContext(AuthContext);
  const [categories, setCategories] = useState(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const getCategories = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/category/', { method: "GET" });
    const categoryJson = await response.json();
    setCategories(categoryJson);
    setCategoriesLoading(false);
  };

  const getItems = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/item/", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (response.ok) {
        setItems(data);
        setIsloading(false);
      } else {
        alert("Une erreur est survenue!");
      }
    } catch (error) {
      alert("Une erreur est survenue!");
      console.error(error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/delete-item/${itemId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + String(authTokens.access)
            }
        });

        if (response.ok) {
            getItems();
        } else {
            alert("Une erreur est survenue lors de la suppression de l'article.");
        }
        } catch (error) {
            alert("Une erreur est survenue lors de la suppression de l'article.");
            console.error(error);
        }
    };

    useEffect(() => {
        getItems();
        getCategories();
    }, []);

    if (isLoading || categoriesLoading) return null;

    const groupedItems = {};

    items.forEach(item => {
        const categoryId = item.category.id;
        if (!groupedItems[categoryId]) {
        groupedItems[categoryId] = [];
        }
        groupedItems[categoryId].push(item);
    });

  return (
    <Box width="80%" margin="90px auto 0 auto" left="10%">
        <Box display="flex" justifyContent="center">
            <Button
                variant="contained"
                sx={{
                    backgroundColor: "#222222",
                    color: "white",
                    borderRadius: 0,
                    padding: "10px 100px",
                    marginBottom: "40px",
                }}
                onClick={() => navigate("./modify-item/")}
            >Ajouter Produit</Button>
        </Box>
        <Box width="100%">
            {categories.map(category => (
                <Box key={category.id} display="flex" justifyContent="center" marginBottom="40px">
                    <Box width="100%">
                        <Typography variant="h2" textAlign="center" margin="20px auto">{category.name}</Typography>
                        <TableContainer component={Paper}>
                            <Table sx={{ width: "100%" }}>
                            <TableHead>
                                <TableRow>
                                <TableCell>Nom</TableCell>
                                <TableCell>Prix</TableCell>
                                <TableCell>Modifie</TableCell>
                                <TableCell>Supprimer</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {groupedItems[category.id] && groupedItems[category.id].map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.price}</TableCell>
                                    <TableCell>
                                    <Button
                                        variant="contained"
                                        sx={{
                                        backgroundColor: "#222222",
                                        color: "white",
                                        borderRadius: 0,
                                        padding: "10px 40px"
                                        }}
                                        onClick={() => navigate(`./modify-item/${item.id}`)}
                                    >Modifier Produit</Button>
                                    </TableCell>
                                    <TableCell>
                                    <Button
                                        variant="contained"
                                        sx={{
                                        backgroundColor: "#222222",
                                        color: "white",
                                        borderRadius: 0,
                                        padding: "10px 40px"
                                        }}
                                        onClick={() => deleteItem(item.id)}
                                    >Supprimer Produit</Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            ))}
        </Box>
    </Box>
    );
};

export default Items;