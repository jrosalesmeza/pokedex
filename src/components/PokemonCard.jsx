import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid2,
} from "@mui/material";

import PropTypes from "prop-types";


export const PokemonCard = ({ name, image, type, stats }) => {
  return (
    <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
      <CardMedia
        component="img"
        sx={{
          height: 200,
          objectFit: 'contain',
          objectPosition: 'center',
        }}
        image={image}
        alt={`${name} image`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" align="center">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Tipo: {type}
        </Typography>
        <Grid2 container spacing={2} justifyContent="center" sx={{ mt: 1 }}>
          {stats.map((stat) => (
            <Grid2 item xs={4} key={stat.name} textAlign="center">
              <Typography variant="subtitle2" color="text.primary">
                {stat.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stat.name}
              </Typography>
            </Grid2>
          ))}
        </Grid2>
      </CardContent>
    </Card>
  );
};


PokemonCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};