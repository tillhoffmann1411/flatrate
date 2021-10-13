import { Stack, Box, Container, TextField, ButtonGroup, Button, Avatar, Chip, List, ListItem, ListItemAvatar, ListItemText, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { useHistory } from 'react-router-dom';
import IApplicant from '../../interfaces/applicant';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { setFilter } from '../../redux/reducers/filter';
import { setApplicant } from '../../redux/reducers/applicants';

export function ApplicantsList() {
  const dispatch = useAppDispatch();
  const allApplicants = useAppSelector(state => state.applicantsReducer.applicants);
  const filter = useAppSelector(state => state.filterReducer);
  const [applicants, setLocalApplicants] = useState<IApplicant[]>([]);
  window.scrollTo(0, filter.position);
  
  useEffect(() => {
    const filteredApplicants = filterSex(allApplicants, !filter.male, !filter.female);
    const rankedApplicants = applySort(filteredApplicants, filter.ranking);
    const searchedApplicants = applySearch(rankedApplicants, filter.searchString);
    setLocalApplicants(searchedApplicants);
    dispatch(setApplicant(undefined));
  }, [allApplicants, filter, dispatch]);

  return <Container sx={{ p: 0 }}>
    <FilterOptions/>
    <Box sx={{ my: 3 }}><hr /></Box> 
    <DisplayList applicants={applicants}/>
  </Container>
}

const DisplayList = ({applicants}: {applicants: IApplicant[]}) => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  return <List>
    {applicants.map(appl => {
      return <ListItem key={appl.id} onClick={() => {
                dispatch(setFilter({position: window.scrollY}));
                history.push('/applicant/' + appl.id);
            }}>
          <ListItemAvatar>
            <Avatar alt={appl.name} src={appl.imageUrl} />
          </ListItemAvatar>
            <ListItemText
            primary={appl.name}
            />
            {appl.gender ?
              <Chip size="small" color={appl.gender === "Männlich" ? "primary" : "secondary"} label={appl.gender === "Männlich" ? "M" : "W"}/>
              : undefined
            }
            <Chip size="small" className={'score-chip'} label={calcRating(appl.ratings)}/>
        </ListItem>;
    })}
  </List>
}

const FilterOptions = () => {
  const filter = useAppSelector(state => state.filterReducer);
  const dispatch = useAppDispatch();

  const [maleToggle, setMaleToggle] = useState<boolean>(true);
  const [femaleToggle, setFemaleToggle] = useState<boolean>(true);

  useEffect(() => {
    setMaleToggle(!filter.male);
    setFemaleToggle(!filter.female);
  }, [filter, setMaleToggle, setFemaleToggle]);

  return <Stack>

      <TextField id="search" label="Suche" variant="outlined" value={filter.searchString.valueOf()} onChange={(e) => {
        dispatch(setFilter({male: false, female: false, searchString: e.target.value}));
      }}/>

      <Box sx={{ my: 1 }} /> 

      <FormGroup>
        <FormControlLabel control={<Checkbox checked={maleToggle} onClick={() => {
          setMaleToggle(!maleToggle)
          dispatch(setFilter({male: maleToggle}));
        }} />} label="Männlich" />
        <FormControlLabel control={<Checkbox checked={femaleToggle} onClick={() => {
          setFemaleToggle(!femaleToggle);
          dispatch(setFilter({female: femaleToggle}));
        }} />} label="Weiblich" />
      </FormGroup>

      <Box sx={{ my: 1 }} /> 

      <ButtonGroup sx={{ mx: "auto" }} color="primary" aria-label="outlined primary button group">
        <Button onClick={() => {
          dispatch(setFilter({ranking: 'newest'}));
        }}>Neuste zuerst</Button>

        <Button onClick={() => {
          dispatch(setFilter({ranking: 'score'}));
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