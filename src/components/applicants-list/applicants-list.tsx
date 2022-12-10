import { Box, Container, List } from '@mui/material';
import IApplicant from '../../interfaces/applicant';
import { useState, useEffect, FC, useContext } from 'react';
import { FilterOptions } from './applicants-list-filter';
import { ApplicantListItem } from './applicants-list-item';
import { applySearch, applySort, filterSex } from './applicants-list.service';
import ApplicantsContext from '../../context/applicants-context';

export const ApplicantsList: FC = () => {
  const { applicants } = useContext(ApplicantsContext);
  window.scrollTo(0, 0);
  
  useEffect(() => {
    // const filteredApplicants = filterSex(allApplicants, !filter.male, !filter.female);
    // const rankedApplicants = applySort(filteredApplicants, filter.ranking);
    // const searchedApplicants = applySearch(rankedApplicants, filter.searchString);
    //setLocalApplicants(searchedApplicants);
    // dispatch(setApplicant(undefined));
  }, [applicants]);

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
