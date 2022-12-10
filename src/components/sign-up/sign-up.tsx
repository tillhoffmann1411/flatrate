import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DEMO_USER_ID } from '../../env';
import UserContext from '../../context/user-context';
import { useState } from 'react';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { LoadingButton } from '@mui/lab';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" component={RouterLink} to="https://flatrate.web.app">
        flatrate
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const { setUser } = React.useContext(UserContext);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const cred = {
      firstName: data.get('firstName') as string,
      lastName: data.get('lastName') as string,
      email: data.get('email') as string,
      password: data.get('password') as string
    };
    if (cred.firstName && cred.lastName && cred.email && cred.password) {
      const authUser = await AuthService.signUp(cred.firstName, cred.lastName, cred.email, cred.password);
      if (authUser) {
        const newUser = await UserService.create({id: authUser.id, firstName: cred.firstName, lastName: cred.lastName, email: cred.email});
        setIsLoading(false);
        setUser(newUser);
        navigate('/apartment');
      } else {
        setIsLoading(false);
        setError('Please fillout every field');
      }
    } else {
      setIsLoading(false);
      setError('Please fillout every field');
    }
  };

  const signInGuest = async () => {
    if (DEMO_USER_ID) {
      await AuthService.signInAsGuest();
      const user = await UserService.getUser(DEMO_USER_ID);
      if (user) {
        setUser(user);
        navigate('/');
      } else {
        setError('There was an error by opening the demo. Please try again later');
      }
    } else {
      setError('No demo user id provided!');
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              { error !== '' && (
              <Typography color="error">
                { error }
              </Typography>
            )}
            </Grid>
            <LoadingButton
              type="submit"
              fullWidth
              loading={isLoading}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </LoadingButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        { DEMO_USER_ID?
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Button
              type="button"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={signInGuest}
            >
              Demo
            </Button>
          </Box>
          : undefined
        }
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}