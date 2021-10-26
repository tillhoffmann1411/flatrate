import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { scrollToTop } from './applicant.service';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';


export const ApplicantFooter: FC = () => {
  const history = useHistory();
  
  return <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
    <Button sx={{ mr: 2, mb: 2 }} variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => history.goBack()}>
      Zurück
    </Button>
    <Button sx={{ mr: 2, mb: 2 }} variant="outlined" endIcon={<ArrowUpwardIcon />} onClick={scrollToTop}>
      Nach oben
    </Button>
  </Box>
}