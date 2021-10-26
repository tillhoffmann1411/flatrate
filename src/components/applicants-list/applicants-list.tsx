import { Box, Container, List } from '@mui/material';
import IApplicant from '../../interfaces/applicant';
import { useState, useEffect, FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { setApplicant } from '../../redux/reducers/applicants';
import { FilterOptions } from './applicants-list-filter';
import { ApplicantListItem } from './applicants-list-item';
import { applySearch, applySort, filterSex } from './applicants-list.service';

export const ApplicantsList: FC = () => {
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
