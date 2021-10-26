import { Grid, Box, Stack } from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { setApplicant } from '../../redux/reducers/applicants';
import { ApplicantRatings } from './applicant-rating';
import { scrollToTop } from './applicant.service';
import { ApplicantFooter } from './applicant-footer';
import { ApplicantText } from './applicant-text';
import { ApplicantEdit } from './applicant-edit';
import { FirebaseService } from '../../services/firebase.service';


export const Applicant = ({id}: {id: string}) => {
  const applicantsState = useAppSelector(state => state.applicantsReducer);
  const dispatch = useAppDispatch();
  const applicant = applicantsState.selectedApplicant;
  const applicants = applicantsState.applicants;
  
  
  useEffect(() => {
    const fetch = async () => {
      const appl = await FirebaseService.getApplicant(id);
      dispatch(setApplicant(appl));
    };
    const cache = () => {
      const appl = applicants.find(a => a.id === id);
      if (appl) dispatch(setApplicant(appl));
    }
    if (applicants.length === 0) {
      fetch();
    } else {
      cache();
    }
    scrollToTop();
  }, [id, applicants, dispatch]);
  
  if (applicant) {
    return <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%'}}>
            <img
              src={applicant.imageUrl}
              alt={''}
              className={'profile-image'}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={2}>
            
            <Box>
              <h1>
                <span className={applicant.gender === 'male' ? 'dot dot-male' : 'dot dot-female'}></span>
                {applicant.name}
              </h1>
            </Box>

            <ApplicantEdit id={applicant.id} />

            <ApplicantRatings applicant={applicant}/>

            <ApplicantText text={applicant.text} />

            <ApplicantFooter />
            
          </Stack>
        </Grid>
    </Grid>
  } else {
    return <div></div>
  }
}
