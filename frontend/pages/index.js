import * as React from "react";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import styles from "../styles/Home.module.scss";
import { CircularProgress, useMediaQuery } from "@mui/material";
import theme from "../src/theme";
import axios from "axios";

export default function Index() {
  const matchDownMd = useMediaQuery(theme.breakpoints.down("sm"));
  const [itemData, setItemData] = React.useState([]);
  React.useEffect(() => {
    if (itemData.length <= 0) {
      axios.get("http://localhost:8080/file/all").then((response) => {
        setItemData(response.data);
      });
    }
  }, []);

  return (
    <Box className={styles.wrapper}>
      <Box className={styles.title}>Lexie.ai</Box>
      <Box className={styles.imagesWrapper}>
        {itemData.length <= 0 ? (
          <Box className={styles.loader}>
            <CircularProgress />
            <Box>Loading...</Box>
          </Box>
        ) : (
          <ImageList variant="masonry" cols={matchDownMd ? 1 : 2} gap={8}>
            {itemData.map((item) => (
              <ImageListItem key={item?.image}>
                <img
                  src={`http://localhost:8080/file/${item?.image}`}
                  srcSet={`http://localhost:8080/file/${item?.image}`}
                  alt={item?.name}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Box>
    </Box>
  );
}
