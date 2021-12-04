import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Route, useHistory } from 'react-router-dom';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { signIn, signInGuest } from '../../redux/reducers/user';
import { DEMO_USER_ID } from '../../env';

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
  const history = useHistory();
  const dispatch = useAppDispatch();
  const loggedIn = useAppSelector(state => state.userReducer.loggedIn);
  const fromPath = props.location!['state']? (props.location!.state as any).from.pathname : '/';


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user = {
      email: data.get('email') as string,
      password: data.get('password') as string
    };
    if (user.email && user.password) {
      dispatch(signIn({ email: user.email, password: user.password}));
      if (loggedIn) {
        history.push(fromPath);
      }

    } else {
      console.error('Error by sign up, check the form!');
    }
  };

  useEffect(() => {
    if (loggedIn) {
      history.push(fromPath);
    }
  }, [loggedIn, history, fromPath]);
  
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
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
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
              onClick={ () => {
                dispatch(signInGuest());
                history.push('/');
              }}
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