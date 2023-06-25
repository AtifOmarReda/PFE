import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { Box, Typography, TextField, Button, useMediaQuery, Select, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import {shades} from "../../theme"

const UpdateProfile = () => {

    const {authTokens, logoutUser} = useContext(AuthContext)
    const [address, setAddress] = useState(null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true)
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

    const profileSchema = yup.object().shape({
        username: yup.string().required('Ce champ est obligatoire'),
        email: yup.string().required('Ce champ est obligatoire').email("Format d'email invalide"),
        telephone: yup
        .number()
        .required("Ce champ est obligatoire")
        .max(9999999999, "Le numéro de téléphone ne doit pas dépasser 10 chiffres"),
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
        updateUser();
      }, []);

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
                alert('Profil mis à jour avec succès'); 
                updateUser();
                navigate("/");
            } else {
                alert('Une erreur est survenue! Déconnexion maintenant');
                logoutUser()
            }
        } catch (error) {
            console.error(error)
            alert('Une erreur est survenue! Déconnexion maintenant');
            logoutUser()
        }
    }

    const wilayahs = [
        { label: '01 - Adrar', value: 'Adrar' },
        { label: '02 - Chlef', value: 'Chlef' },
        { label: '03 - Laghouat', value: 'Laghouat' },
        { label: '04 - Oum El Bouaghi', value: 'Oum El Bouaghi' },
        { label: '05 - Batna', value: 'Batna' },
        { label: '06 - Béjaïa', value: 'Béjaïa' },
        { label: '07 - Biskra', value: 'Biskra' },
        { label: '08 - Béchar', value: 'Béchar' },
        { label: '09 - Blida', value: 'Blida' },
        { label: '10 - Bouira', value: 'Bouira' },
        { label: '11 - Tamanrasset', value: 'Tamanrasset' },
        { label: '12 - Tébessa', value: 'Tébessa' },
        { label: '13 - Tlemcen', value: 'Tlemcen' },
        { label: '14 - Tiaret', value: 'Tiaret' },
        { label: '15 - Tizi Ouzou', value: 'Tizi Ouzou' },
        { label: '16 - Alger', value: 'Alger' },
        { label: '17 - Djelfa', value: 'Djelfa' },
        { label: '18 - Jijel', value: 'Jijel' },
        { label: '19 - Sétif', value: 'Sétif' },
        { label: '20 - Saïda', value: 'Saïda' },
        { label: '21 - Skikda', value: 'Skikda' },
        { label: '22 - Sidi Bel Abbès', value: 'Sidi Bel Abbès' },
        { label: '23 - Annaba', value: 'Annaba' },
        { label: '24 - Guelma', value: 'Guelma' },
        { label: '25 - Constantine', value: 'Constantine' },
        { label: '26 - Médéa', value: 'Médéa' },
        { label: '27 - Mostaganem', value: 'Mostaganem' },
        { label: '28 - M\'Sila', value: 'M\'Sila' },
        { label: '29 - Mascara', value: 'Mascara' },
        { label: '30 - Ouargla', value: 'Ouargla' },
        { label: '31 - Oran', value: 'Oran' },
        { label: '32 - El Bayadh', value: 'El Bayadh' },
        { label: '33 - Illizi', value: 'Illizi' },
        { label: '34 - Bordj Bou Arréridj', value: 'Bordj Bou Arréridj' },
        { label: '35 - Boumerdès', value: 'Boumerdès' },
        { label: '36 - El Tarf', value: 'El Tarf' },
        { label: '37 - Tindouf', value: 'Tindouf' },
        { label: '38 - Tissemsilt', value: 'Tissemsilt' },
        { label: '39 - El Oued', value: 'El Oued' },
        { label: '40 - Khenchela', value: 'Khenchela' },
        { label: '41 - Souk Ahras', value: 'Souk Ahras' },
        { label: '42 - Tipaza', value: 'Tipaza' },
        { label: '43 - Mila', value: 'Mila' },
        { label: '44 - Aïn Defla', value: 'Aïn Defla' },
        { label: '45 - Naâma', value: 'Naâma' },
        { label: '46 - Aïn Témouchent', value: 'Aïn Témouchent' },
        { label: '47 - Ghardaïa', value: 'Ghardaïa' },
        { label: '48 - Relizane', value: 'Relizane' },
        { label: '49 - El M\'Ghair', value: 'El M\'Ghair' },
        { label: '50 - El Menia', value: 'El Menia' },
        { label: '51 - Ouled Djellal', value: 'Ouled Djellal' },
        { label: '52 - Bordj Baji Mokhtar', value: 'Bordj Baji Mokhtar' },
        { label: '53 - Béni Abbès', value: 'Béni Abbès' },
        { label: '54 - Timimoun', value: 'Timimoun' },
        { label: '55 - Touggourt', value: 'Touggourt' },
        { label: '56 - Djanet', value: 'Djanet' },
        { label: '57 - Ain Salah', value: 'Ain Salah' },
        { label: '58 - Ain Guezzam', value: 'Ain Guezzam' },
    ];

    if(loading || loadingUser) return null

    const initialValues = {
        username: user.username,
        email: user.email,
        telephone: user.telephone,
        address: address
    }

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
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    type="number"
                                    label="Numéro de téléphone"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.telephone}
                                    name="telephone"
                                    error={!!touched.telephone && !!errors.telephone}
                                    helperText={
                                        touched.telephone && errors.telephone
                                        ? errors.telephone
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
                                <Select
                                    fullWidth
                                    label="Wilaya"
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
                                    sx={{ gridColumn: "1fr" }}
                                    >
                                    {wilayahs.map((wilayah) => (
                                        <MenuItem key={wilayah.value} value={wilayah.value}>
                                        {wilayah.label}
                                        </MenuItem>
                                    ))}
                                </Select>
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
                onClick={() => navigate("../profile/modify-password")}
            >Modifier le mot de passe</Button>
        </Box>
    )
}

export default UpdateProfile;