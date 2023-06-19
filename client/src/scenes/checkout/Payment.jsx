import { Box, Typography, TextField } from "@mui/material"

const Payment = ({values, touched, errors, handleBlur, handleChange}) => {
    return (
        <Box m="30px 0">
            <Box>
                <Typography sx={{mb: "15px"}} fontSize="18px">
                    Informations de contact
                </Typography>
                <TextField
                    fullWidth
                    type="text"
                    label="E-mail"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 4", marginBottom: "15px"}}
                />
                <TextField
                    fullWidth
                    type="number"
                    label="Numéro de téléphone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phoneNumber}
                    name="phoneNumber"
                    error={!!touched.phoneNumber && !!errors.phoneNumber}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                    sx={{ gridColumn: "span 4"}}
                />
            </Box>
        </Box>
    )
}

export default Payment;