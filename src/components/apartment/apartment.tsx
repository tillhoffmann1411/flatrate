import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Route } from 'react-router-dom';
import { FC, useContext, useEffect, useState } from 'react';
import { IUser } from '../../interfaces/user';
import { ApartmentService } from '../../services/apartment.service';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from '@mui/material';
import ApartmentJoin from './apartment-join';
import ApartmentCreate from './apartment-create';
import ProfileCard from './profle-card';
import UserContext from '../../context/user-context';
import ApartmentContext from '../../context/apartment-context';
import { LoadingButton } from '@mui/lab';


const theme = createTheme();

const Apartment: FC<React.ComponentProps<typeof Route>> = (props) => {
  const [flatmates, setFlatmates] = useState<IUser[]>([]);
  const { user, setUser } = useContext(UserContext);
  const { apartment, setApartment } = useContext(ApartmentContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (apartment) {
      setFlatmates(apartment.flatmates);
    }
  }, [setFlatmates, apartment]);

  const leaveApartment = async () => {
    if (user && apartment) {
      setIsLoading(true);
      const newUser = await ApartmentService.leave(apartment.identifier, user.id);
      if (newUser) {
        setIsLoading(false);
        setUser(newUser);
        setApartment(undefined);
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <ProfileCard />
      <Divider sx={{ my: 3 }} />
      {user && !apartment ?
        <Box>
          <ApartmentJoin />
          <Divider sx={{ my: 3 }} />
          <ApartmentCreate />
        </Box>
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
                WG {apartment?.name}
              </Typography>

              <List sx={{ width: '100%' }}>
                {
                  flatmates.map(mate => {
                    const name = `${mate.firstName} ${mate.lastName}`;
                    return (
                      <ListItem key={mate.id}>
                        <ListItemAvatar>
                          <Avatar alt={name} src="" children={`${mate.firstName[0]}${mate.lastName[0]}`} />
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
                Copy invitation link
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  endIcon={<ContentCopyIcon />}
                  onClick={() => navigator.clipboard.writeText(apartment ? apartment.identifier : '')}
                >
                  Copy
                </Button>
                <TextField
                  margin="normal"
                  disabled
                  fullWidth
                  value={apartment?.identifier}
                  id="wg-invitation"
                  label="Invitation link"
                  name="wg-invitation"
                  type="url"
                />
              </Box>
            </Box>

            <Divider />


            <LoadingButton
              type="button"
              onClick={leaveApartment}
              sx={{ mt: 3, mb: 2, width: '100%' }}
              variant="contained"
              loading={isLoading}
              color="error"
            >
              Leave Flat
            </LoadingButton>
          </Box>
        </Container>
      }
    </ThemeProvider>
  );
}

export default Apartment;