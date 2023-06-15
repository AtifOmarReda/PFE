import { Box, useMediaQuery, TextField} from "@mui/material";
import { getIn } from "formik";


const AddressForm = ({
    type,
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
}) => {
    const isNonMobile = useMediaQuery("(min-width: 600px)");

    const formattedName = (field) => `${type}.${field}`;

    const formattedError = (field) => 
        Boolean(
            getIn(touched, formattedName(field)) &&
            getIn(errors, formattedName(field))
        );

    const formattedHelper = (field) =>
        getIn(touched, formattedName(field)) && getIn(errors, formattedName(field));

    
    return (
        <Box
            display="grid"
            gap="15px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4"}
            }}
        >
            <TextField
                fullWidth
                type="text"
                label="Prénom"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.first_name}
                name={formattedName("first_name")}
                error={formattedError("first_name")}
                helperText={formattedHelper("first_name")}
                sx={{ gridColumn: "span 2"}}
            />
            <TextField
                fullWidth
                type="text"
                label="Nom"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.last_name}
                name={formattedName("last_name")}
                error={formattedError("last_name")}
                helperText={formattedHelper("last_name")}
                sx={{ gridColumn: "span 2"}}
            />
            <TextField
                fullWidth
                type="text"
                label="Adresse de la rue"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.street1}
                name={formattedName("street1")}
                error={formattedError("street1")}
                helperText={formattedHelper("street1")}
                sx={{ gridColumn: "span 2"}}
            />
            <TextField
                fullWidth
                type="text"
                label="Adresse de la rue 2 (facultatif)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.street2}
                name={formattedName("street2")}
                error={formattedError("street2")}
                helperText={formattedHelper("street2")}
                sx={{ gridColumn: "span 2"}}
            />
            <TextField
                fullWidth
                type="text"
                label="Ville"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.city}
                name={formattedName("city")}
                error={formattedError("city")}
                helperText={formattedHelper("city")}
                sx={{ gridColumn: "span 2"}}
            />
            <TextField
                fullWidth
                type="text"
                label="Wilayah"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.state}
                name={formattedName("state")}
                error={formattedError("state")}
                helperText={formattedHelper("state")}
                sx={{ gridColumn: "1fr"}}
            />
            <TextField
                fullWidth
                type="text"
                label="Code Postal"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.zipcode}
                name={formattedName("zipcode")}
                error={formattedError("zipcode")}
                helperText={formattedHelper("zipcode")}
                sx={{ gridColumn: "1fr"}}
            />
        </Box>
    )
};

export default AddressForm;