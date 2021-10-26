import { Box, FormControl, InputLabel, Select } from '@mui/material';
import { FC } from 'react';
import IApplicant from '../../interfaces/applicant';
import { updateApplicant } from '../../redux/reducers/applicants';
import { useAppDispatch } from '../../redux/store';
import { FirebaseService } from '../../services/firebase.service';
import { getFlatmates } from './applicant.service';

export const ApplicantRatings: FC<{applicant: IApplicant}> = ({ applicant }) => {
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
      {
        getFlatmates().map(name => {
          return <FormControl key={name} variant="outlined">
            <InputLabel htmlFor="outlined-age-native-simple">{name}</InputLabel>
            <Select
              autoWidth
              native
              value={applicant.ratings[name.toLowerCase() as keyof IApplicant['ratings']]}
              onChange={(event) => {
                const name = event.target.name!.toLowerCase();
                const value = parseInt(event.target.value! as string);
                const newApplicant = {
                  ...applicant,
                  ratings: {
                    ...applicant.ratings,
                    [name]: value
                  }
                }
                FirebaseService.updateApplicant(newApplicant);
  
                dispatch(updateApplicant({...applicant, ratings: {
                  ...applicant!.ratings,
                  [name.toLowerCase() as keyof IApplicant['ratings']]: parseInt(event.target.value as string)}}));
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
