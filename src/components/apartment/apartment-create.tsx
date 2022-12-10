import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Route } from 'react-router-dom';
import { FC, useContext, useState } from 'react';
import UserContext from '../../context/user-context';
import { ApartmentService } from '../../services/apartment.service';
import { UserService } from '../../services/user.service';
import ApartmentContext from '../../context/apartment-context';
import { LoadingButton } from '@mui/lab';


const ApartmentCreate: FC<React.ComponentProps<typeof Route>> = (props) => {
  const { user } = useContext(UserContext);
  const { setApartment } = useContext(ApartmentContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('wg-name') as string;
    if (name && user) {
      const apartment = await ApartmentService.create(name, user);
      if (apartment) {
        setIsLoading(false);
        setApartment(apartment);
      }
    } else {
      setIsLoading(false);
      console.error('Error by creating new WG, check the form!');
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        marginTop: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5">
        Create new flat
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="wg-name"
          label="Flat Name"
          name="wg-name"
          type="text"
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2, width: '100%' }}
          type="submit"
          variant="contained"
          loading={isLoading}
            >
          Create Flat
        </LoadingButton>
      </Box>
    </Box>
  );
}

export default ApartmentCreate;