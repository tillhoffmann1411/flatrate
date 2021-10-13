import { Container, FormControl, Grid, InputLabel, Select, SelectChangeEvent, Typography } from '@mui/material';
import IApplicant from '../../interfaces/applicant';
import { get, ref, update } from 'firebase/database';
import { db } from '../../App';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { setApplicant, updateApplicant } from '../../redux/reducers/applicants';

export const Applicant = ({id}: {id: string}) => {
  const applicantsState = useAppSelector(state => state.applicantsReducer);
  const dispatch = useAppDispatch();
  const applicant = applicantsState.selectedApplicant;
  const applicants = applicantsState.applicants;

  window.scrollTo(0, 0);

  useEffect(() => {
    const fetch = async () => {
      const appl = await fetchApplicant(id);
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
  }, [id, applicants, dispatch]);
  
  if (applicant) {
    return <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <img
            src={applicant.imageUrl}
            alt={''}
            className={'profile-image'}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <h1>
            <span className={applicant.gender === 'Männlich' ? 'dot dot-male' : 'dot dot-female'}></span>
            {applicant.name}
          </h1>
        </Grid>
        <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
          {
            getFlatmates().map(name => {
              return <FormControl key={name} variant="outlined">
                <InputLabel htmlFor="outlined-age-native-simple">{name}</InputLabel>
                <Select
                  autoWidth
                  native
                  value={applicant!.ratings[name.toLowerCase() as keyof IApplicant['ratings']]}
                  onChange={(event) => {
                    handleChange(event, applicant!.id, applicant!.ratings);

                    dispatch(updateApplicant({...applicant!, ratings: {
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <Container>
            <Typography variant="body1" gutterBottom>
              {applicant.text}
            </Typography>
          </Container>
        </Grid>
    </Grid>
  } else {
    return <div></div>
  }
}

const handleChange = async (event: SelectChangeEvent<number>, id: string, ratings: IApplicant['ratings']) => {
  console.log(event);
  const dbRef = ref(db, 'applicants/' + id);
  const name = event.target.name!.toLowerCase();
  const value = parseInt(event.target.value! as string);
  console.log(name, ':', value);
  await update(dbRef, {
    ratings: {
      ...ratings,
      [name]: value
    }
  });

};

const fetchApplicant = async (id: string): Promise<IApplicant> => {
  const dbRef = ref(db, 'applicants/' + id);
  const snapshot = await get(dbRef);
  return snapshot.val() as IApplicant;
}

const getFlatmates = () => {
  return [
    'Maike',
    'Emily',
    'Till',
    'Max'
  ]
}