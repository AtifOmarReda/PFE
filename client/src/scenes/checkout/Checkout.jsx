import { useSelector } from 'react-redux';
import { Box, Button, Stepper, Step, StepLabel } from "@mui/material";
import { Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import * as yup from "yup";
import { shades } from "../../theme";
import Shipping from "./Shipping";
import Payment from "./Payment";
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
    "pk_test_51Mz2xSCOfbo60LIUYvsGY8gbx61dakPbKvWCVZ1OLigzLCBes5DzjoDYhygn5ivFrgdA7JVDfZFXGOlYYFZvsjLo0059je5lql"
);

const Checkout = () => {

    const { logoutUser, authTokens } = useContext(AuthContext)

    const [shippingAddress, setShippingAddress] = useState(null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true)

    const navigate = useNavigate()

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
                setShippingAddress(data)
                setLoading(false)
            } else{
                alert("Une erreur est survenue! Déconnexion maintenant")
                logoutUser()
                navigate("/")
            }
        } catch (error) {
            alert('Une erreur est survenue! Déconnexion maintenant');
            logoutUser()
            navigate("/")
        }
    }

    useEffect(() => {
        getAddress();
        updateUser();
      }, []);

    const checkoutSchema = [
        yup.object().shape({
            shippingAddress: yup.object().shape({
                first_name: yup.string().required("Ce champ est obligatoire"),
                last_name: yup.string().required("Ce champ est obligatoire"),
                street1: yup.string().required("Ce champ est obligatoire"),
                street2: yup.string().default(""),
                city: yup.string().required("Ce champ est obligatoire"),
                state: yup.string().required("Ce champ est obligatoire"),
                zipcode: yup.string().required("Ce champ est obligatoire")
            }),
        }),
        yup.object().shape({
            email: yup.string().required("Ce champ est obligatoire"),
            phoneNumber: yup
            .number()
            .required("Ce champ est obligatoire")
            .max(9999999999, "Le numéro de téléphone ne doit pas dépasser 10 chiffres"),
        })
    ]

    const [activeStep, setActiveStep] = useState(0);
    const cart = useSelector((state) => state.cart.cart);
    const isFirstStep = activeStep === 0;
    const isSecondStep = activeStep === 1;

    const handleFormSubmit = async (values, actions) => {
        if(isFirstStep) setActiveStep(activeStep+1);
        
        if(isSecondStep){
            if(cart.length > 0){
                UpdateProfile();
                makePayment();
            } else alert("Il doit y avoir des produits dans le panier pour passer au paiement")
        }

        actions.setTouched({});
    };

    const UpdateProfile = async (values) => {

        const requestBody = {
            username: user.username,
            email: values.email,
            telephone: values.phoneNumber,
            address: values.shippingAddress
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/update-profile/', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + String(authTokens.access)
              },
              body: JSON.stringify(requestBody),
            });
    
            if (response.ok) {
                alert('Profil mis à jour avec succès'); 
                navigate("/");
            } else {
                alert('Une erreur est survenue! Déconnexion maintenant');
                logoutUser()
            }
        } catch (error) {
            alert('Une erreur est survenue! Déconnexion maintenant');
            logoutUser()
        }
    }

    const makePayment = async () => {
        const stripe = await stripePromise
        const requestBody = {
            products: cart.map(({id, count}) => ({
                id, count
            }))
        }

        const response = await fetch("http://127.0.0.1:8000/api/stripe/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'JWT ' + String(authTokens.access)
            },
            body: JSON.stringify(requestBody)
        })
        const session = await response.json()
        await stripe.redirectToCheckout({
            sessionId: session.id
        })
    }

    if(loading || loadingUser) return null

    const initialValues = {
        shippingAddress: shippingAddress,
        email: user ? user.email : "",
        phoneNumber: user ? user.telephone : "",
    }

    return (
        <Box width="80%" m="100px auto">
            <Stepper activeStep={activeStep} sx={{ m: "20px 0"}}>
                <Step>
                    <StepLabel>Livraison</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Paiement</StepLabel>
                </Step>
            </Stepper>
            <Box>
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={checkoutSchema[activeStep]}
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
                            {isFirstStep && (
                                <Shipping 
                                    values={values}
                                    errors={errors}
                                    touched={touched}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    setFieldValue={setFieldValue}
                                />
                            )}
                            {isSecondStep && (
                                <Payment 
                                    values={values}
                                    errors={errors}
                                    touched={touched}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    setFieldValue={setFieldValue}
                                />
                            )}
                            <Box display="flex" justifyContent="space-between" gap="50px">
                                {!isFirstStep && (
                                    <Button
                                        fullWidth
                                        color="primary"
                                        variant="contained"
                                        sx={{
                                            backgroundColor: shades.primary[200],
                                            boxShadow: "none",
                                            color: "white",
                                            borderRadius: 0,
                                            padding: "15px 40px"
                                        }}
                                        onClick={() => {setActiveStep(activeStep-1)}}
                                    >Retourner</Button>
                                )}
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
                                            padding: "15px 40px"
                                        }}
                                    >{!isSecondStep ? "Suivant" : "Passer la commande"}</Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box>
    )
}

export default Checkout;