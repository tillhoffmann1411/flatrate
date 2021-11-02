import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Route } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import { createApartment } from '../../redux/reducers/user';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { IUser } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from '@mui/material';

import SendIcon from '@mui/icons-material/Send';


const theme = createTheme();

const Apartment: FC<React.ComponentProps<typeof Route>> = (props) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.userReducer.user as IUser | undefined);
  const [flatmates, setFlatmates] = useState<IUser[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('wg-name') as string;
    if (name) {
      dispatch(createApartment({ name }));
    } else {
      console.error('Error by creating new WG, check the form!');
    }
  };

  const handleInvitation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    if (email) {
      console.log('Invite', email, 'to WG');
    } else {
      console.error('Error by creating new WG, check the form!');
    }
  };

  useEffect(() => {
    const getAllFlatmates = async () => {
      if (user && user.apartment) {
        const mates = await UserService.getAllUserFromApartment(user.apartment.id);
        if (mates) setFlatmates(mates);
      }
    }
    getAllFlatmates();
  }, [setFlatmates, user]);

  return (
    <ThemeProvider theme={theme}>
      { !user?.apartment? 
        <Container maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              WG erstellen
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="wg-name"
                label="WG Name"
                name="wg-name"
                type="text"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Erstellen
              </Button>
            </Box>
          </Box>
        </Container>
        :
        <Container maxWidth="xs">
          <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ p: 2, border: '1px solid grey', borderRadius: 2, width: '100%' }}>
              <Typography component="h1" variant="h5">
                WG { user?.apartment.name }
              </Typography>

              <List sx={{ width: '100%', maxWidth: 420 }}>
                {
                  flatmates.map(mate => {
                    const name = `${mate.firstName} ${mate.lastName}`;
                    return (
                      <ListItem key={mate.id}>
                        <ListItemAvatar>
                          <Avatar alt={name} src="" children={`${name.split(' ')[0][0]}${name.split(' ')[1][0]}`} />
                        </ListItemAvatar>
                        <ListItemText primary={name} secondary={mate.email} />
                      </ListItem>
                    );
                  })
                }
              </List>
            </Box>

            <Divider />

            <Box
                sx={{
                  marginTop: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  border: '1px solid grey',
                  borderRadius: 2,
                  width: '100%'
                }}
              >
                <Typography component="h2" variant="h5">
                  Jemanden zu WG einladen
                </Typography>
                <Box component="form" onSubmit={handleInvitation} sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email deines Mitbwohners"
                    name="email"
                    type="email"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    endIcon={<SendIcon />}
                  >
                    Einladen
                  </Button>
                </Box>
              </Box>

              <Divider />

              <Button
                type="button"
                onClick={() => console.log('Austreten!')}
                fullWidth
                color="error"
                variant="contained"
                sx={{ mt: 6, mb: 2 }}
              >
                Aus WG austreten
              </Button>
          </Box>
        </Container>
      }
    </ThemeProvider>
  );
}

export default Apartment;