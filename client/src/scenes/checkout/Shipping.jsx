import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import AddressForm from "./AddressForm";

const Shipping = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
}) => {
    return (
        <Box m="30px auto">
            <Box>
                <Typography sx={{ mb: "15px"}} fontSize="18px">
                    Détails de facturation
                </Typography>
                <AddressForm 
                    type="billingAddress"
                    values={values.billingAddress}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                />
            </Box>

            <Box mb="20px">
                <FormControlLabel 
                    label="Même pour l'adresse de livraison."
                    control={
                        <Checkbox 
                            defaultChecked
                            value={values.shippingAddress.isSameAddress}
                            onChange={() =>
                                setFieldValue(
                                    "shippingAddress.isSameAddress",
                                    !values.shippingAddress.isSameAddress
                                )
                            }
                        />
                    }
                />
            </Box>

            {!values.shippingAddress.isSameAddress && (
                <Box>
                    <Typography sx={{ mb: "15px"}} fontSize="18px">
                        Informations sur la livraison
                    </Typography>
                    <AddressForm 
                        type="shippingAddress"
                        values={values.shippingAddress}
                        errors={errors}
                        touched={touched}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                    />
                </Box>
            )}
        </Box>
    )
}

export default Shipping;