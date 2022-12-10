import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Route } from 'react-router-dom';
import { FC, useContext, useEffect, useState } from 'react';
import { DEMO_USER_ID } from '../../env';
import UserContext from '../../context/user-context';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { LoadingButton } from '@mui/lab';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" component={RouterLink} to="https://flatrate.web.app/">
        flatrate
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

const SignIn: FC<React.ComponentProps<typeof Route>> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, user } = useContext(UserContext);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fromPath = location.pathname;


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const cred = {
      email: data.get('email') as string,
      password: data.get('password') as string
    };
    if (cred.email && cred.password) {
      const authUser = await AuthService.signIn(cred.email, cred.password);
      if (authUser) {
        const user = await UserService.getUser(authUser.id)
        setIsLoading(false);
        setUser(user);
        let route = fromPath.includes('signin') ? '/' : fromPath;
        route = user?.apartmentId ? route : '/apartment';
        navigate(route);
      } else {
        setIsLoading(false);
        setError('Your email or password is incorrect');
      }
    } else {
      setIsLoading(false);
      setError('Please input your email and password');
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
  };

  useEffect(() => {
    if (user) {
      navigate(fromPath);
    }
  }, [user, fromPath]);
  
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            { error !== '' && (
              <Typography color="error">
                { error }
              </Typography>
            )}
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              loading={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
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
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;