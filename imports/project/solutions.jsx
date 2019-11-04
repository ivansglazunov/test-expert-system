// @flow

import React, { useState, useEffect } from 'react';

import { makeStyles, Grid, TextField, LinearProgress, List, ListItem, ListItemText, IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import useAxios from 'axios-hooks';
import axios from 'axios';

const useStyles = makeStyles(() => ({
  symptomListItem: {
    position: 'relative',
  },
  symptomListItemBack: {
    position: 'absolute',
    left: -24,
    top: 0,
  },
}));

export const Solutions = ({ symptomQuery }: { symptomQuery: string }) => {
  const classes = useStyles();

  const [{ data, loading, error }, refetch] = useAxios(
    `/api/find?query=${symptomQuery}`
  );
  const [time, setTime] = useState(null);
  const [sym, setSym] = useState(0);

  useEffect(() => setSym(0), [symptomQuery]);

  const symptoms = data && data.symptoms && data.symptoms.length ? sym ? data.symptoms.filter(s => s.id === sym) : data.symptoms : [];

  return <>
    {time && loading ? <LinearProgress /> : <LinearProgress variant="determinate" value={0}/>}
    {!!symptomQuery.trim() && !loading && !!data && (
      <List>
        {symptoms.map(symptom => {
          return <React.Fragment key={symptom.id}>
            <ListItem
              key={symptom.id} divider={symptoms.length <= 1}
              button={symptoms.length > 1}
              onClick={() => sym || setSym(symptom.id)}
              className={classes.symptomListItem}
            >
              {(symptoms.length === 1 && data.symptoms.length > 1) && (
                <IconButton
                  className={classes.symptomListItemBack}
                  onClick={() => setSym(0)}
                ><ArrowBackIcon/></IconButton>
              )}
              <ListItemText style={{
                opacity: sym || symptoms.length === 1 ? 0.6 : 1,
              }}>{symptom.value}</ListItemText>
            </ListItem>
            {symptoms.length === 1 && symptom.solutions.map(solution => (
              <ListItem key={solution.id}>
                <ListItemText>{solution.value}</ListItemText>
              </ListItem>
            ))}
          </React.Fragment>;
        })}
      </List>
    )}
  </>;
};
