import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const Failure = () => {
  return (
    <Box m="90px auto" width="80%" height="50vh">
      <Alert severity="error">
        <AlertTitle>Échec</AlertTitle>
        Une erreur s'est produite lors de la création de votre commande —{" "}
        <strong>Veuillez réessayer!</strong>
      </Alert>
    </Box>
  );
};

export default Failure;