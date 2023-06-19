import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { Box, Typography, TextField, Button, Stepper, useMediaQuery } from "@mui/material";
import { Formik, getIn } from "formik";
import * as yup from "yup";
import {shades} from "../../theme"

const UpdateProfile = () => {

    const {user, authTokens, logoutUser} = useContext(AuthContext)
    const [address, setAddress] = useState(null)
    const [loading, setLoading] = useState(true)
    const isNonMobile = useMediaQuery("(min-width: 600px)")

    const getAddress = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/address/', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + String(authTokens.access)
              },
            });
    
            let data = await response.json()

            if(response.status === 200){
                setAddress(data)
                setLoading(false)
            } else if(response.statusText === 'Unauthorized'){
                alert('Une erreur est survenue! Déconnexion maintenant');
                logoutUser()
                navigate("/")
            }
        } catch (error) {
            alert('Une erreur est survenue! Déconnexion maintenant');
            logoutUser()
            navigate("/")
        }
    }

    const profileSchema = yup.object().shape({
        username: yup.string().required('Required'),
        email: yup.string().required('Required').email('Invalid email format'),
        address: yup.object().shape({
          first_name: yup.string().default(''),
          last_name: yup.string().default(''),
          street1: yup.string().default(''),
          street2: yup.string().default(''),
          city: yup.string().default(''),
          state: yup.string().default(''),
          zipcode: yup.string().default('')
        })
      });

    useEffect(() => {
        getAddress();
      }, [user]);

    const initialValues = {
        username: user.username,
        email: user.email,
        address: address
    }

    const navigate = useNavigate()

    const handleFormSubmit = async (values) => {

        try {
            const response = await fetch('http://127.0.0.1:8000/api/update-profile/', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + String(authTokens.access)
              },
              body: JSON.stringify(values),
            });
    
            if (response.ok) {
                alert('Profile updated successfully! Changes will appear in a few minutes...');
                navigate("/");
            } else {
                alert('An error has occured! Logging out');
                logoutUser()
            }
        } catch (error) {
            alert('An error has occured! Logging out');
            logoutUser()
        }
    }

    if(loading) return null

    return (
        <Box width="80%" m="100px auto">
            <Formik
                validationSchema={profileSchema}
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
                                Profile
                            </Typography>
                            <Box 
                                display="grid"
                                gap="15px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4"}
                                }}
                            >
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    type="text"
                                    label="Nom d'utilisateur"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.username}
                                    name="username"
                                    error={!!touched.username && !!errors.username}
                                    helperText={
                                        touched.username && errors.username
                                        ? errors.username
                                        : null
                                    }
                                    sx={{ gridColumn: "span 4"}}
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    type="email"
                                    label="E-mail"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={!!touched.email && !!errors.email}
                                    helperText={
                                        touched.email && errors.email
                                        ? errors.email
                                        : null
                                    }
                                    sx={{ gridColumn: "span 4"}}
                                />
                                <Typography sx={{ gridColumn: "span 4" }} fontSize="18px">
                                    Addresse
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="text"
                                    label="Prénom"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.address.first_name}
                                    name="address.first_name"
                                    error={!!touched.first_name && !!errors.first_name}
                                    helperText={
                                        touched.first_name && errors.first_name
                                        ? errors.first_name
                                        : null
                                    }
                                    sx={{ gridColumn: "span 2"}}
                                />
                                <TextField
                                    fullWidth
                                    type="text"
                                    label="Nom"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.address.last_name}
                                    name="address.last_name"
                                    error={!!touched.last_name && !!errors.last_name}
                                    helperText={
                                        touched.last_name && errors.last_name
                                        ? errors.last_name
                                        : null
                                    }
                                    sx={{ gridColumn: "span 2"}}
                                />
                                <TextField
                                    fullWidth
                                    type="text"
                                    label="Adresse de la rue"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.address.street1}
                                    name="address.street1"
                                    error={!!touched.street1 && !!errors.street1}
                                    helperText={
                                        touched.street1 && errors.street1
                                        ? errors.street1
                                        : null
                                    }
                                    sx={{ gridColumn: "span 2"}}
                                />
                                <TextField
                                    fullWidth
                                    type="text"
                                    label="Adresse de la rue 2 (facultatif)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.address.street2}
                                    name="address.street2"
                                    error={!!touched.street2 && !!errors.street2}
                                    helperText={
                                        touched.street2 && errors.street2
                                        ? errors.street2
                                        : null
                                    }
                                    sx={{ gridColumn: "span 2"}}
                                />
                                <TextField
                                    fullWidth
                                    type="text"
                                    label="Ville"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.address.city}
                                    name="address.city"
                                    error={!!touched.city && !!errors.city}
                                    helperText={
                                        touched.city && errors.city
                                        ? errors.city
                                        : null
                                    }
                                    sx={{ gridColumn: "span 2"}}
                                />
                                <TextField
                                    fullWidth
                                    type="text"
                                    label="Wilayah"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.address.state}
                                    name="address.state"
                                    error={!!touched.state && !!errors.state}
                                    helperText={
                                        touched.state && errors.state
                                        ? errors.state
                                        : null
                                    }
                                    sx={{ gridColumn: "1fr"}}
                                />
                                <TextField
                                    fullWidth
                                    type="text"
                                    label="Code Postale"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.address.zipcode}
                                    name="address.zipcode"
                                    error={!!touched.zipcode && !!errors.zipcode}
                                    helperText={
                                        touched.zipcode && errors.zipcode
                                        ? errors.zipcode
                                        : null
                                    }
                                    sx={{ gridColumn: "1fr"}}
                                />
                            </Box>
                            <Button
                                margin="normal"
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
                                    marginTop: "20px"
                                }}
                            >Sauvegarder</Button>
                        </form>
                    )
                }
            </Formik>
            <Button
                margin="normal"
                fullWidth
                color="primary"
                variant="contained"
                    sx={{
                        backgroundColor: shades.primary[400],
                        boxShadow: "none",
                        color: "white",
                        borderRadius: 0,
                        padding: "15px 40px",
                        marginTop: "20px"
                    }}
            >Changer le mot de passe</Button>
        </Box>
    )
}

export default UpdateProfile;