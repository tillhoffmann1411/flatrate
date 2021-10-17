import { Stack, Box, Container, TextField, ButtonGroup, Button, ListItemIcon, Avatar, Chip, List, ListItem, ListItemAvatar, ListItemText, Checkbox, FormControlLabel, FormGroup, Badge } from '@mui/material';
import { useHistory } from 'react-router-dom';
import IApplicant from '../../interfaces/applicant';
import { useState, useEffect, FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { setFilter } from '../../redux/reducers/filter';
import { setApplicant } from '../../redux/reducers/applicants';
import { red, blue, orange, green } from '@mui/material/colors';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import { addApplicant, removeApplicant } from '../../redux/reducers/edit';

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
    <Box sx={{ my: 3 }}>
      <hr />
      <div>Anzahl aller Bewerber: {applicants.length}</div>
      <div>Anzahl der Einladungen: {applicants.filter(a => a.status === 'invited').length}</div>
      <div>Anzahl Bewerber ohne Absage: {applicants.filter(a => a.status !== 'rejected').length}</div>
    </Box> 
    <DisplayList applicants={applicants}/>
  </Container>
}

const DisplayList = ({applicants}: {applicants: IApplicant[]}) => {
  return <List>
    {applicants.map(appl => <ApplicantListItem key={appl.id} applicant={appl} />)}
  </List>
}

const ApplicantListItem: FC<{applicant: IApplicant}> = ({ applicant }) => {
  const states = [
    { title: 'rejected', color: red[700], icon: <CancelIcon />},
    { title: 'open', color: blue[700], icon: <Box />},
    { title: 'invited', color: orange[700], icon: <InsertInvitationIcon />},
    { title: 'accpeted', color: green[700], icon: <CheckCircleIcon />},
  ]
  const history = useHistory();
  const dispatch = useAppDispatch();
  const applicantStatus = states.find(s => s.title === applicant.status);
  const editMode = useAppSelector(state => state.editReducer.editMode);
  const [checked, setChecked] = useState<boolean>(false);

  const handleClick = () => {
    dispatch(setFilter({position: window.scrollY}));
    history.push('/applicant/' + applicant.id);
  };

  const getBadge = () => {
    if (applicantStatus) {
      return applicantStatus.icon
    } else {
      return <Badge color="secondary" badgeContent=" " />
    }
  }

  const handleCheck = () => {
    setChecked(!checked);
    if (!checked) {
      dispatch(addApplicant(applicant));
    } else {
      dispatch(removeApplicant(applicant));
    }
  }
  return (
  <ListItem key={applicant.id} onClick={editMode? handleCheck : handleClick}>
    { editMode?
      <ListItemIcon>
        <Checkbox
          checked={checked}
          tabIndex={-1}
          disableRipple
          inputProps={{ 'aria-labelledby': applicant.id }}
        />
      </ListItemIcon>
    : undefined}
    <ListItemAvatar>
      { applicantStatus ?
        <Badge
        overlap="circular"
        sx={{ color: applicantStatus.color, bgcolor: 'white' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={getBadge()}
        >
        <Avatar alt={applicant.name} src={applicant.imageUrl} />
      </Badge>
      :
      <Avatar alt={applicant.name} src={applicant.imageUrl} />
    }
    </ListItemAvatar>
    <ListItemText primary={applicant.name}/>
    <GenderChip gender={applicant.gender} />
    <Chip size="small" className={'score-chip'} label={calcRating(applicant.ratings)}/>
  </ListItem>)
};

const GenderChip: FC<{gender?: string}> = ({gender}) => {
  if (!gender) {
    return <span></span>;
  }
  const genderColor = gender === "Männlich" ? "primary" : "secondary";
  const genderLabel = gender === "Männlich" ? "M" : "W";
  return <Chip size="small" color={genderColor} label={genderLabel}/>;
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