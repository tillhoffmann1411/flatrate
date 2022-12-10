import Box from '@mui/material/Box';
import { Route } from 'react-router-dom';
import { FC, useContext } from 'react';
import UserContext from '../../context/user-context';
import { Card, CardHeader, Avatar } from '@mui/material';
import { red } from '@mui/material/colors';


const ProfileCard: FC<React.ComponentProps<typeof Route>> = (props) => {
  const { user } = useContext(UserContext);

  return (
    <Box
      sx={{
        width: '100%',
        padding: 2,
      }}
    >
      {user &&
        <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {`${user.firstName[0]}${user.lastName[0]}`}
            </Avatar>
          }
          title={user.firstName + ' ' + user.lastName}
          subheader={user.email}
        />
        </Card>
      }
    </Box>
  );
}

export default ProfileCard;