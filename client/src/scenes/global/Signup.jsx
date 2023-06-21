import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Stepper } from "@mui/material";
import { Formik, getIn } from "formik";
import * as yup from "yup";
import { shades } from "../../theme";

const signupSchema = yup.object().shape
({
    username: yup.string().required("Le nom d'utilisateur est un champ obligatoire."),
    email: yup.string().required("L'e-mail est un champ obligatoire.").email("Format d'email invalide"),
    password: yup.string()
    .required('Mot de passe est un champ obligatoire')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial')
    .min(8, 'Le mot de passe doit comporter au moins 8 caractères'),
    confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Les mots de passe doivent correspondre')
    .required('Confirmer le mot de passe est un champ obligatoire'),
    });
  

const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
}

const Signup = ({updateSignedUp}) => {

    const navigate = useNavigate()

    const handleLoginClick = () => {
        updateSignedUp();
    };

    const handleFormSubmit = async (values, actions) => {
        const { username, email, password } = values
        const newValues = {username, email, password}
        
        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(newValues),
            });
      
            if (response.ok) {
                updateSignedUp()
                alert("Inscrit avec succès !")
                navigate('/')
            } else {
                actions.resetForm({})
                alert("Échec de l'enregistrement");
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de l'inscription :", error);
        }
        actions.setTouched({})
    }

    return (
        <Box
        sx={{
            margin: "25px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }} >
            <Formik
                validationSchema={signupSchema}
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
                                Inscrivez-Vous
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    type="text"
                                    label="Nom d'utilisateur *"
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
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    type="email"
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
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    type="password"
                                    label="Confirmer le mot de passe *"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.confirmPassword}
                                    name="confirmPassword"
                                    error={!!touched.confirmPassword && !!errors.confirmPassword}
                                    helperText={
                                        touched.confirmPassword && errors.confirmPassword
                                        ? errors.confirmPassword
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
                                >Inscrivez-Vous</Button>
                            </Box>
                        </form>
                    )
                }
            </Formik>
            <Typography mt="15px">
                Vous avez un compte ?{' '}
                <Button
                onClick={handleLoginClick}
                style={{
                    textTransform: 'none',
                    color: 'blue',
                    fontSize: 'inherit',
                    padding: 0,
                }}
                >
                Connectez-vous
                </Button>
            </Typography>
        </Box>
    )
}

export default Signup;