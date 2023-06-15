import { useNavigate, useParams } from "react-router-dom";
import { Box, List, ListItem, ListItemIcon, ListItemButton, ListItemAvatar, Avatar, ListItemText} from "@mui/material";

const Categories = (categories) => {

    const navigate = useNavigate();

    return (
        <Box boxShadow="2" sx={{ maxHeight: "500px", overflow: "auto"}}>
            <List>
            {categories.categories.map(category => (
                
                <ListItem key={category.id} disablePadding>
                    <ListItemButton onClick={() => navigate(`/category/${category.id}`)}>
                        <ListItemIcon>
                            <img style={{width: "32px", height: "32px"}} src={`http://127.0.0.1:8000/${category.image}`}></img>
                        </ListItemIcon>
                        
                        <ListItemText primary={category.name} />
                     </ListItemButton>
                </ListItem>
            ))}
            </List>
        </Box>
    );
}

export default Categories;