// @flow

import React, { useState, useEffect } from 'react';

import { makeStyles, Grid, TextField, LinearProgress, List, ListItem, ListItemText, IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { gql, useGql, useQuery } from '../packages/gql/use';

const QUERY = gql`
  query QUERY($where: symptoms_bool_exp) {
    symptoms(where: $where) {
      id
      value
      solutions {
        id
        value
      }
    }
  }
`;

const generateWhere = (symptom) => {
  const r = { _or: symptom.split(' ').map(str => ({ value: { _like: `%${str}%` }})) };
  return r;
};

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

  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { where: generateWhere(symptomQuery.trim()) },
  });
  const [time, setTime] = useState(null);
  const [sym, setSym] = useState(0);

  useEffect(() => {
    clearTimeout(time);
    setTime(setTimeout(() => {
      setTime(null);
      setSym(0);
      refetch({ where: generateWhere(symptomQuery.trim()) });
    }, 1000));
  }, [symptomQuery]);

  const symptoms = data ? sym ? data.symptoms.filter(s => s.id === sym) : data.symptoms : [];

  return <>
    {time && loading ? <LinearProgress /> : <LinearProgress variant="determinate" value={0}/>}
    {!!symptomQuery.trim() && !loading && !!data && (
      <List>
        {symptoms.map(symptom => {
          var words = symptomQuery.split(' ');
          var results = [];
          var last = 0;
          for (let i = 0; i < symptom.value.length; i++) {
            for (let w = 0; w < words.length; w++) {
              if (words[w] && words[w] == symptom.value.slice(i, i+words[w].length)) {
                results.push(
                  <>{symptom.value.slice(last, i)}</>,
                  <span style={{ color: 'red' }}>{symptom.value.slice(i, i+words[w].length)}</span>
                );
                last = i+words[w].length;
                i += words[w].length - 1;
              }
            }
          }
          results.push(symptom.value.slice(last));
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
              <ListItemText>{results}</ListItemText>
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
