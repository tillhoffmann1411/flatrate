import { Avatar, Chip, List, ListItem, ListItemAvatar, ListItemText, Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import IApplicant from '../../interfaces/applicant';
import { useState, useEffect } from 'react';
import { Stack, Box, Container, TextField, ButtonGroup, Button } from '@mui/material';


export function ApplicantsList({rawApplicants}: {rawApplicants: IApplicant[]}) {
  let [applicants, setApplicants] = useState<IApplicant[]>([]);
  useEffect(() => {
    setApplicants(applySort(rawApplicants, 'newest'));
  }, [rawApplicants]);
  return <Container sx={{ p: 0 }}>
    <FilterOptions applicants={rawApplicants} cb={(sortedAppl) => setApplicants(sortedAppl)}/>
    <Box sx={{ my: 3 }}><hr /></Box> 
    <DisplayList applicants={applicants}/>
  </Container>
}

const DisplayList = ({applicants}: {applicants: IApplicant[]}) => {
  const history = useHistory();

  return <List>
    {applicants.map(appl => {
      return <ListItem key={appl.id} onClick={() => history.push('/applicant/' + appl.id)}>
          <ListItemAvatar>
            <Avatar alt={appl.name} src={appl.imageUrl} />
          </ListItemAvatar>
            <ListItemText
            primary={appl.name}
            />
            {appl.gender ?
              <Chip color={appl.gender === "Männlich" ? "primary" : "secondary"} label={appl.gender === "Männlich" ? "M" : "W"}/>
              : undefined
            }
            <Chip label={calcRating(appl.ratings)}/>
        </ListItem>;
    })}
  </List>
}

const FilterOptions = ({applicants, cb}: {applicants: IApplicant[], cb: (applicants: IApplicant[]) => void}) => {
  let [male, setMale] = useState<boolean>(true);
  let [female, setFemale] = useState<boolean>(true);

  return <Stack>

      <TextField id="search" label="Suche" variant="outlined" onChange={(e) => {
        const filtered = applySearch(applicants, e.target.value);
        setMale(true);
        setFemale(true);
        cb(filtered);
      }}/>

      <Box sx={{ my: 1 }} /> 

      <FormGroup>
        <FormControlLabel control={<Checkbox checked={male} onClick={() => {
          setMale(!male);
          cb(filterSex(applicants, !male, female));
        }} />} label="Männlich" />
        <FormControlLabel control={<Checkbox checked={female} onClick={() => {
          setFemale(!female);
          cb(filterSex(applicants, male, !female));
        }} />} label="Weiblich" />
      </FormGroup>

      <Box sx={{ my: 1 }} /> 

      <ButtonGroup sx={{ mx: "auto" }} color="primary" aria-label="outlined primary button group">
        <Button onClick={() => {
          const filtered = filterSex(applicants, male, female);
          const newAppls = applySort(filtered, 'newest');
          cb(newAppls);
        }}>Neuste zuerst</Button>

        <Button onClick={() => {
          const filtered = filterSex(applicants, male, female);
          const newAppls = applySort(filtered, 'score');
          cb(newAppls);
        }}>Höchster Score</Button>
      </ButtonGroup>

  </Stack>
}

const applySearch = (applicants: IApplicant[], search: string) => {
  return [...applicants].filter(applicant => {
      return applicant.name.toLowerCase().includes(search.toLowerCase());
  })
}

const applySort = (applicants: IApplicant[], ranking: 'newest' | 'score') => {
  switch (ranking) {
      case "newest": {
        applicants.sort((a: IApplicant, b: IApplicant) => {
              return b.when - a.when;
          });
          return [...applicants];
      }
      case "score": {
        applicants.sort((a: IApplicant, b: IApplicant) => {
              const ratingA = calcRating(a.ratings);
              const ratingB = calcRating(b.ratings);
              return ratingB - ratingA;
          });
        return [...applicants];
      }
  }
}

const filterSex = (applicants: IApplicant[], male: boolean, female: boolean): IApplicant[] => {
  const filter: string[] = [];
  if (male) filter.push('Männlich');
  if (female) filter.push('Weiblich');
  return [...applicants].filter(a => a.gender ? filter.includes(a.gender) : true);
}

const calcRating = (ratingsObj: IApplicant['ratings']): number => {
  const unsafeRatings = Object.values(ratingsObj) as (string|number)[];
  const ratings = unsafeRatings.map(r => typeof r === 'string'? parseInt(r) : r) as number[];
  const numOfRatings = ratings.length;
  const avgRating = Math.round(ratings.reduce((a: number, b: number) => a + b, 0) / numOfRatings * 100) / 100;
  return avgRating;
}