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

    const { user, logoutUser, authTokens } = useContext(AuthContext)

    const [billingAddress, setBillingAddress] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

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
                setBillingAddress(data)
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
      }, [user]);

    const initialValues = {
        billingAddress: billingAddress,
        shippingAddress: {
            isSameAddress: true,
            first_name: "",
            last_name: "",
            street1: "",
            street2: "",
            city: "",
            state: "",
            zipcode: ""
        },
        email: user ? user.email : "",
        phoneNumber: "",
    }

    const checkoutSchema = [
        yup.object().shape({
            billingAddress: yup.object().shape({
                first_name: yup.string().required("required"),
                last_name: yup.string().required("required"),
                street1: yup.string().required("required"),
                street2: yup.string().default(""),
                city: yup.string().required("required"),
                state: yup.string().required("required"),
                zipcode: yup.string().required("required")
            }),
            shippingAddress: yup.object().shape({
                isSameAddress: yup.boolean(),
                first_name: yup.string().when("isSameAddress", {
                    is: false,
                    then: yup.string().required("required")
                }),
                last_name: yup.string().when("isSameAddress", {
                    is: false,
                    then: yup.string().required("required")
                }),
                street1: yup.string().when("isSameAddress", {
                    is: false,
                    then: yup.string().required("required")
                }),
                street2: yup.string(),
                city: yup.string().when("isSameAddress", {
                    is: false,
                    then: yup.string().required("required")
                }),
                state: yup.string().when("isSameAddress", {
                    is: false,
                    then: yup.string().required("required")
                }),
                zipcode: yup.string().when("isSameAddress", {
                    is: false,
                    then: yup.string().required("required")
                }),
            }),
        }),
        yup.object().shape({
            email: yup.string().required("required"),
            phoneNumber: yup.string().required("required"),
        })
    ]

    const [activeStep, setActiveStep] = useState(0);
    const cart = useSelector((state) => state.cart.cart);
    const isFirstStep = activeStep === 0;
    const isSecondStep = activeStep === 1;

    const handleFormSubmit = async (values, actions) => {
        setActiveStep(activeStep+1);

        if(isFirstStep && values.shippingAddress.isSameAddress) {
            actions.setFieldValue("shippingAddress", {
                ...values.billingAddress,
                isSameAddress: true,
            })
        }
        
        if(isSecondStep){
            makePayment();
        }

        actions.setTouched({});
    };

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

    if(loading) return null

    return (
        <Box width="80%" m="100px auto">
            <Stepper activeStep={activeStep} sx={{ m: "20px 0"}}>
                <Step>
                    <StepLabel>Facturation</StepLabel>
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