import { Container, FormControl, Grid, InputLabel, makeStyles, Select } from '@material-ui/core';
import IApplicant from '../../interfaces/applicant';
import { get, ref, update } from 'firebase/database';
import { db } from '../../App';
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';


const useStyles = makeStyles((theme) => ({
  dot: {
    height: '1rem',
    width: '1rem',
    borderRadius: '50%',
    display: 'inline-block',
  },
  female: {
    backgroundColor: '#e83e8c'
  },
  male: {
    backgroundColor: '#007bff'
  },
  profileImage: {
    maxWidth: '100%'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export const Applicant = ({id}: {id: string}) => {
  const classes = useStyles();

  let [applicant, setApplicant] = useState<IApplicant>();
  useEffect(() => {
    const fetch = async () => {
      const appl = await fetchApplicant(id);
      setApplicant(appl);
    };
    fetch();
  }, [id]);
  if (applicant) {
    return <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <img
            src={applicant.imageUrl}
            alt={''}
            className={classes.profileImage}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {
              applicant.gender?
              <span className={classes.dot + applicant.gender === 'Männlich' ? classes.male : classes.female}></span>
              : undefined
          }
          <h1>{applicant.name}</h1>
        </Grid>
        <Grid>
          {
            getFlatmates().map(name => {
              return <FormControl key={name} variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">{name}</InputLabel>
                <Select
                  native
                  value={applicant!.ratings[name.toLowerCase() as keyof IApplicant['ratings']]}
                  onChange={(event) => {
                    handleChange(event, applicant!.id, applicant!.ratings);
                    setApplicant({...applicant!, ratings: {
                      ...applicant!.ratings,
                      [name.toLowerCase() as keyof IApplicant['ratings']]: event.target.value}
                    });
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

const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>, id: string, ratings: IApplicant['ratings']) => {
  const dbRef = ref(db, 'applicants/' + id);
  const name = event.target.name!.toLowerCase();
  const value = Number(event.target.value!);
  update(dbRef, {
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