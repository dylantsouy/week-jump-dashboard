import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "./index.scss";

export default function Loading(props) {
  const { color, size } = props;
  return (
    <Box className="loading">
      <CircularProgress color={color || "primary"} size={size} />
    </Box>
  );
}
