import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { Box, Typography, TextField, Button, useMediaQuery} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import {shades} from "../../theme"

const ModifyPassword = () => {

    const itemId = useParams()
    const isNonMobile = useMediaQuery("(min-width: 600px)")
    const navigate = useNavigate()
    const { authTokens, logoutUser } = useContext(AuthContext)

    const itemSchema = yup.object().shape({
        old_password: yup.string().required("Ce champ est obligatoire"),
        new_password: yup.string()
        .required("Ce champ est obligatoire")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial')
        .min(8, 'Le mot de passe doit comporter au moins 8 caractères'),
        confirm_password: yup.string()
        .oneOf([yup.ref('new_password'), null], 'Les mots de passe doivent correspondre')
        .required('Confirmer le nouveau mot de passe est un champ obligatoire'),
    })

    const handleReturnClick = () => {
        navigate(-1);
    };

    const handleFormSubmit = async (values) => {

        try {
            const response = await fetch('http://127.0.0.1:8000/api/modify-password/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT ' + String(authTokens.access)
                },
                body: JSON.stringify(values)
            });
            if (response.ok) {
                alert('Nouveau mot de passe enregistré avec succès, veuillez vous reconnecter maintenant');
                logoutUser();
            } else {
                alert("Erreur lors de l'enregistrement de mot de passe");
            }
        } catch (error) {
            alert('Network error');
        }
    };

    const initialValues = {
        old_password: "",
        new_password: "",
        confirm_password: ""
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
                                Modifier mot de passe
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <TextField
                                    variant="standard"
                                    margin="normal"
                                    fullWidth
                                    type="password"
                                    label="Ancien mot de passe *"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.old_password}
                                    name="old_password"
                                    error={!!touched.old_password && !!errors.old_password}
                                    helperText={
                                        touched.old_password && errors.old_password
                                        ? errors.old_password
                                        : null
                                    }
                                />
                                <TextField
                                    variant="standard"
                                    margin="normal"
                                    fullWidth
                                    type="password"
                                    label="Nouveau mot de passe *"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.new_password}
                                    name="new_password"
                                    error={!!touched.new_password && !!errors.new_password}
                                    helperText={
                                        touched.new_password && errors.new_password
                                        ? errors.new_password
                                        : null
                                    }
                                />
                                <TextField
                                    variant="standard"
                                    margin="normal"
                                    fullWidth
                                    type="password"
                                    label="Confirmer le nouveau mot de passe *"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.confirm_password}
                                    name="confirm_password"
                                    error={!!touched.confirm_password && !!errors.confirm_password}
                                    helperText={
                                        touched.confirm_password && errors.confirm_password
                                        ? errors.confirm_password
                                        : null
                                    }
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
                                            Modifier le mot de passe
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

export default ModifyPassword;