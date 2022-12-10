import { Box, FormControl, InputLabel, Select } from '@mui/material';
import { FC, useContext } from 'react';
import ApplicantsContext from '../../context/applicants-context';
import IApplicant from '../../interfaces/applicant';
import { ApplicantService } from '../../services/applicant.service';

export const ApplicantRatings: FC<{applicant: IApplicant}> = ({ applicant }) => {
  const { updateApplicant } = useContext(ApplicantsContext);
  const sortedRatings = [...applicant.ratings].sort((a, b) => {
    if (Object.keys(a)[0] > Object.keys(b)[0]) {
      return 1;
    } else if (Object.keys(a)[0] < Object.keys(b)[0]) {
      return -1;
    }
    return 0;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
      {
        sortedRatings.map(ratingObj => {
          const name = Object.keys(ratingObj)[0];
          const rating = ratingObj[name];
          return <FormControl key={name} variant="outlined">
            <InputLabel htmlFor="outlined-age-native-simple">{name}</InputLabel>
            <Select
              autoWidth
              native
              value={rating}
              onChange={(event) => {
                const value = parseInt(event.target.value! as string);
                const newApplicant = {
                  ...applicant,
                  ratings: [
                    ...(applicant.ratings.filter(r => Object.keys(r)[0] !== name)),
                    { [name]: value }
                  ]
                }
                ApplicantService.updateFirestoreApplicant(newApplicant);
  
                updateApplicant(newApplicant);
              }}
              label="Rating"
              inputProps={{
                name: name,
              }}
            >
              <option aria-label="None" value="" />
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </Select>
          </FormControl>
        })
      }
    </Box>
  )
}
