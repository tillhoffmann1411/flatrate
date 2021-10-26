import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { FC } from 'react';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';

export const ApplicantEdit: FC<{id: string}> = ({ id }) => {
  return <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
    <Button variant="outlined"  endIcon={<LaunchRoundedIcon />} href={'https://wg-bewerbertool.firebaseapp.com/edit-applicant?id=' + id} target="_blank" sx={{mb: 3}}>
      Bearbeiten
    </Button>
  </Box>
}