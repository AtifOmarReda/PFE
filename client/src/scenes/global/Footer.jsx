import { useTheme } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { shades } from "../../theme";

const Footer = () => {
    const { palette: { neutral } } = useTheme()

    return (
        <Box mt="70px" p="40px 0" backgroundColor={neutral.light}>
            <Box
                width="80%"
                margin="auto"
                display="flex"
                justifyContent="space-between"
                flexWrap="wrap"
                rowGap="30px"
                columnGap="clamp(20px, 30px, 40px)"
            >
                <Box width="clamp(20%, 30%, 40%)">
                    <Typography 
                        variant="h4" 
                        fontWeight="bold" 
                        mb="30px" 
                        color={shades.secondary}
                    >
                        MOCHTARAYATI
                    </Typography>
                    <div>
                        Bienvenue chez MOCHTARAYATI ! Nous sommes une épicerie en ligne dédiée à vous fournir des produits frais et de qualité directement à votre porte. Parcourez notre vaste sélection de fruits, légumes, viandes, produits laitiers et bien plus encore. Avec MOCHTARAYATI, faire vos courses n'a jamais été aussi facile. Profitez d'une expérience de magasinage pratique, d'une livraison rapide et d'un service client exceptionnel. Simplifiez votre vie en commandant tous vos articles essentiels chez MOCHTARAYATI dès aujourd'hui !
                    </div>
                </Box>

                <Box>
                    <Typography 
                        variant="h4" 
                        fontWeight="bold"
                        mb="30px"
                    >
                        À propos de nous
                    </Typography>
                    <Typography mb="30px">Carrières</Typography>
                    <Typography mb="30px">Nos magasins</Typography>
                    <Typography mb="30px">Termes et conditions</Typography>
                    <Typography mb="30px">Politique de confidentialité</Typography>
                </Box>
                <Box>
                    <Typography 
                        variant="h4" 
                        fontWeight="bold"
                        mb="30px"
                    >
                        Service clientèle
                    </Typography>
                    <Typography mb="30px">Centre d'aide</Typography>
                    <Typography mb="30px">Suivez votre commande</Typography>
                    <Typography mb="30px">Achats en gros et pour les entreprises</Typography>
                    <Typography mb="30px">Retours et remboursements</Typography>
                </Box>
                <Box width="clamp(20%, 25%, 30%)">
                    <Typography 
                        variant="h4" 
                        fontWeight="bold"
                        mb="30px"
                    >
                        Contactez-nous
                    </Typography>
                    <Typography mb="30px">Rue 30 Batiment, Alger, Algerie 16000</Typography>
                    <Typography mb="30px">Email: mochtarayati@gmail.com</Typography>
                    <Typography mb="30px">(213) 555-6789</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default Footer;