import { Stack, TextField, Box, FormGroup, FormControlLabel, Checkbox, ButtonGroup, Button } from '@mui/material';
import { useState, useEffect, FC } from 'react';
import { setFilter } from '../../redux/reducers/filter';
import { useAppSelector, useAppDispatch } from '../../redux/store';

export const FilterOptions: FC = () => {
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