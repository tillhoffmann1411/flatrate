import { Grid, Box, Stack } from '@mui/material';
import { FC, useContext, useEffect, useState } from 'react';
import { ApplicantRatings } from './applicant-rating';
import { scrollToTop } from './applicant.service';
import { ApplicantFooter } from './applicant-footer';
import { ApplicantText } from './applicant-text';
import { ApplicantEdit } from './applicant-edit';
import { ApplicantService } from '../../services/applicant.service';
import UserContext from '../../context/user-context';
import { useSearchParams } from 'react-router-dom';
import ApplicantsContext from '../../context/applicants-context';
import IApplicant from '../../interfaces/applicant';


export const Applicant: FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useContext(UserContext);
  const [applicant, setApplicant] = useState<undefined | IApplicant>(undefined);
  const {applicants} = useContext(ApplicantsContext);
  
  
  useEffect(() => {
    const fetch = async (applicantId: string) => {
      if (user && user.apartmentId) {
        const appl = await ApplicantService.getApplicant(user.apartmentId, applicantId);
        setApplicant(appl);
      }
    };
    const cache = (applicantId: string) => {
      const appl = applicants.find(a => a.id === applicantId);
      console.log('cache', appl);
      if (appl) {setApplicant(appl);} else {fetch(applicantId);}
    }
    
    const applicantId = searchParams.get('id') || '';
    if (applicants.length === 0) {
      fetch(applicantId);
    } else {
      cache(applicantId);
    }
    scrollToTop();
  }, [searchParams, applicants, setApplicant, user]);
  
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
