import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetCart } from "../../state";
import AuthContext from "../../context/AuthContext";

const Confirmation = () => {

  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart.cart)
  const { authTokens } = useContext(AuthContext)
  const [orderCreated, setOrderCreated] = useState(false)

  const createOrder = async () => {
    const requestBody = {
        products: cart.map(({id, count}) => ({
            id, count
        }))
    }

    const response = await fetch("http://127.0.0.1:8000/api/orders/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'JWT ' + String(authTokens.access)
        },
        body: JSON.stringify(requestBody)
    })
  }

  useEffect(() => {

    if(!orderCreated){ 
      setOrderCreated(true)
      createOrder();
    }
    dispatch(resetCart());

  }, [dispatch]);

  return (
    <Box m="90px auto" width="80%" height="50vh">
      <Alert severity="success">
        <AlertTitle>Succès</AlertTitle>
          Vous avez passé commande avec succès —{" "}
          <strong>Félicitations pour votre achat</strong>
      </Alert>
    </Box>
  );
};

export default Confirmation;