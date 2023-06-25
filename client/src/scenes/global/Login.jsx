import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Stepper } from "@mui/material";
import { Formik, getIn } from "formik";
import * as yup from "yup";
import { shades } from "../../theme"
import AuthContext from '../../context/AuthContext';

const loginSchema = yup.object().shape({
        email: yup.string().required("L'e-mail est un champ obligatoire."),
        password: yup.string().required('Le mot de passe est un champ obligatoire.')
});
  

const initialValues = {
    email: "",
    password: "",
}

const Login = ({updateIsLoggedIn, loginUser}) => {

    const navigate = useNavigate();

    const handleFormSubmit = async (values, actions) => {
        try {
            let loggedIn = await loginUser(values)
            if(loggedIn) updateIsLoggedIn()
            actions.setTouched({})
        } catch(err){
            console.error(err.message)
        }
    }

    return (
        <Box
        sx={{
            margin: "50px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }} >
            <Formik
                validationSchema={loginSchema}
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
                                Connectez-Vous
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    type="text"
                                    label="E-mail *"
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
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    type="password"
                                    label="Mot de passe *"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    name="password"
                                    error={!!touched.password && !!errors.password}
                                    helperText={
                                        touched.password && errors.password
                                        ? errors.password
                                        : null
                                    }
                                />
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
                                        marginTop: "15px"
                                    }}
                                >Connectez-Vous</Button>
                            </Box>
                        </form>
                    )
                }
            </Formik>
        </Box>
    )
}

export default Login;