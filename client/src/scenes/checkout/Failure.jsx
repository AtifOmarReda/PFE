import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const Failure = () => {
  return (
    <Box m="90px auto" width="80%" height="50vh">
      <Alert severity="error">
        <AlertTitle>Failure</AlertTitle>
        There was an error creating your order —{" "}
        <strong>Please try again</strong>
      </Alert>
    </Box>
  );
};

export default Failure;