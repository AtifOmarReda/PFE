import { Box, useMediaQuery, TextField, Select, MenuItem} from "@mui/material";
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

    const wilayas = [
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
            <Select
                fullWidth
                label="Wilaya"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.state}
                name={formattedName("state")}
                error={formattedError("state")}
                helperText={formattedHelper("state")}
                sx={{ gridColumn: "1fr" }}
                >
                {wilayas.map((wilaya) => (
                    <MenuItem key={wilaya.value} value={wilaya.value}>
                    {wilaya.label}
                    </MenuItem>
                ))}
            </Select>
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