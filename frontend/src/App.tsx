import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Card, CardContent, CardActions, Button, CircularProgress } from '@mui/material';
import { LocalBar as LocalBarIcon } from '@mui/icons-material';
import { backend } from 'declarations/backend';

interface Drink {
  id: number;
  name: string;
  ingredients: string[];
  price: number;
  description: string | null;
}

const App: React.FC = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [bartenderStatus, setBartenderStatus] = useState<string>('idle');
  const [loading, setLoading] = useState<boolean>(true);
  const [orderMessage, setOrderMessage] = useState<string>('');

  useEffect(() => {
    fetchDrinks();
    fetchBartenderStatus();
  }, []);

  const fetchDrinks = async () => {
    try {
      const result = await backend.getDrinkMenu();
      setDrinks(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching drinks:', error);
      setLoading(false);
    }
  };

  const fetchBartenderStatus = async () => {
    try {
      const status = await backend.getBartenderStatus();
      setBartenderStatus(status);
    } catch (error) {
      console.error('Error fetching bartender status:', error);
    }
  };

  const handleOrder = async (drinkId: number) => {
    setLoading(true);
    try {
      const result = await backend.orderDrink(BigInt(drinkId));
      setOrderMessage(result);
      fetchBartenderStatus();
    } catch (error) {
      console.error('Error ordering drink:', error);
      setOrderMessage('Failed to place order. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" gutterBottom align="center">
        Interactive Bartender
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Drink Menu
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2}>
              {drinks.map((drink) => (
                <Grid item xs={12} sm={6} key={drink.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        {drink.name}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        ${drink.price.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" component="p">
                        {drink.description}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Ingredients: {drink.ingredients.join(', ')}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleOrder(drink.id)}
                        startIcon={<LocalBarIcon />}
                      >
                        Order
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h4" gutterBottom>
            Bartender Status
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Status: {bartenderStatus}
              </Typography>
              {orderMessage && (
                <Typography variant="body1" color="secondary">
                  {orderMessage}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
