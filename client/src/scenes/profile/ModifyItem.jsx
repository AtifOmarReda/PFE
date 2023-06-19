import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { Box, Typography, TextField, Button, Stepper, useMediaQuery, MenuItem, Select, FormControl, InputLabel} from "@mui/material";
import { Formik, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import {shades} from "../../theme"

const ModifyItem = () => {

    const itemId = useParams()
    const [item, setItem] = useState(null)
    const [loading, setIsLoading] = useState(true)
    const isNonMobile = useMediaQuery("(min-width: 600px)")
    const [categories, setCategories] = useState(null)
    const [categoriesLoading, setCategoriesLoading] = useState(true)
    const navigate = useNavigate()
    const { authTokens } = useContext(AuthContext)

    const getCategories = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/category/', {method: "GET"})
        const categoryJson = await response.json()
        setCategories(categoryJson)
        setCategoriesLoading(false)
    }

    const getItem = async () => {
        const response = await fetch(`http://localhost:8000/api/item?item_id=${itemId.itemId}`);
        const itemJson = await response.json();
        setItem(itemJson);
        setIsLoading(false);
    }

    const itemSchema = yup.object().shape({
        name: yup.string().required("Required"),
        category: yup.string().required("Required"),
        mainCategory: yup.string().required("Required"),
        price: yup.string().required("Required"),
        image: yup.mixed().notRequired(),
    })

    const handleReturnClick = () => {
        navigate(-1);
    };

    useEffect(() => {
        getCategories()
        if(Object.keys(itemId).length !== 0) getItem();
        else setIsLoading(false)
    }, []);

    const handleFormSubmit = async (values) => {
        const formData = new FormData();
        if(Object.keys(itemId).length !== 0) formData.append('itemId', itemId.itemId)
        formData.append('name', values.name)
        formData.append('category', values.category);
        formData.append('mainCategory', values.mainCategory)
        formData.append('price', values.price)
        if (values.image) formData.append("image", values.image)
    
        const requestOptions = {
            method: Object.keys(itemId).length !== 0 ? 'PUT' : 'POST',
            headers: {
                'Authorization': 'JWT ' + String(authTokens.access)
            },
            body: formData,
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/modify-item/', requestOptions);
            if (response.ok) {
                alert('Produit enregistré avec succès');
                navigate(-1);
            } else {
                alert("Erreur lors de l'enregistrement de produit");
            }
        } catch (error) {
            alert('Network error');
        }
    };

    if(loading || categoriesLoading) return null

    const initialValues = {
        name: item ? item[0].name : "",
        category: item ? item[0].category.id : "",
        mainCategory: item ? item[0].mainCategory : "",
        price: item ? item[0].price : "",
        image: null,
    };  

    return (
        <Box width="80%" m="100px auto">
            <Formik
                validationSchema={itemSchema}
                initialValues={initialValues}
                onSubmit={handleFormSubmit}
            >
                {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        setFieldValue,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Typography sx={{ mb: "15px" }} fontSize="18px" align="center">
                            {Object.keys(itemId).length !== 0
                                ? `Modifier ${item[0].name}`
                                : "Ajouter un produit"}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <TextField
                                    variant="standard"
                                    margin="normal"
                                    fullWidth
                                    type="text"
                                    label="Nom de produit *"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.name}
                                    name="name"
                                    error={!!touched.name && !!errors.name}
                                    helperText={
                                        touched.name && errors.name
                                        ? errors.name
                                        : null
                                    }
                                />
                                <TextField
                                    variant="standard"
                                    margin="normal"
                                    fullWidth
                                    type="text"
                                    label="Prix *"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.price}
                                    name="price"
                                    error={!!touched.price && !!errors.price}
                                    helperText={
                                        touched.price && errors.price
                                        ? errors.price
                                        : null
                                    }
                                />
                                <FormControl
                                    margin="normal"
                                    fullWidth
                                    error={!!touched.category && !!errors.category}
                                >
                                    <InputLabel>Catégorie *</InputLabel>
                                    <Select
                                        variant="standard"
                                        name="category"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.category}
                                    >
                                        {categories.map(category => (
                                            <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                        ))}
                                    </Select>
                                    <ErrorMessage name="category" component="div" />
                                </FormControl>
                                <FormControl
                                    margin="normal"
                                    fullWidth
                                    error={!!touched.mainCategory && !!errors.mainCategory}
                                >
                                    <InputLabel>Catégorie Boutique *</InputLabel>
                                    <Select
                                        variant="standard"
                                        name="mainCategory"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.mainCategory}
                                    >
                                        <MenuItem value="newArrivals">Nouveautés</MenuItem>
                                        <MenuItem value="bestSellers">Meilleures ventes</MenuItem>
                                        <MenuItem value="topRated">Les mieux notés</MenuItem>
                                    </Select>
                                    <ErrorMessage name="mainCategory" component="div" />
                                </FormControl>
                                <TextField
                                    variant="standard"
                                    margin="normal"
                                    fullWidth
                                    type="file"
                                    label="Image *"
                                    onBlur={handleBlur}
                                    onChange={(event) => {
                                    setFieldValue("image", event.currentTarget.files[0]);
                                    }}
                                    name="image"
                                    error={!!touched.image && !!errors.image}
                                    helperText={touched.image && errors.image ? errors.image : null}
                                />
                                <Box display="flex" justifyContent="space-between">
                                    <Box flex="1" marginRight="10px">
                                        <Button
                                            fullWidth
                                            type="button"
                                            color="primary"
                                            variant="contained"
                                            onClick={handleReturnClick}
                                            sx={{
                                                backgroundColor: shades.primary[400],
                                                boxShadow: "none",
                                                color: "white",
                                                borderRadius: 0,
                                                padding: "15px 40px",
                                                marginTop: "15px"
                                            }}
                                        >
                                            Retourner
                                        </Button>
                                    </Box>
                                    <Box flex="1">
                                        <Button
                                            fullWidth
                                            type="submit"
                                            color="primary"
                                            variant="contained"
                                            sx={{
                                                backgroundColor: shades.primary[400],
                                                boxShadow: "none",
                                                color: "white",
                                                borderRadius: 0,
                                                padding: "15px 40px",
                                                marginTop: "15px",
                                                marginLeft: "10px"
                                            }}
                                        >
                                            {item ? "Modifier le produit" : "Ajouter le produit"}
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </form>
                    )
                }
            </Formik>
        </Box>
    )
}

export default ModifyItem;