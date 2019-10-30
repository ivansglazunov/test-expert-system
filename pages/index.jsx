// @flow
import React, { useState } from 'react';

import { makeStyles, Grid, TextField, Paper } from '@material-ui/core';

import { wrapPage } from '../imports/wrap-page';
import { useTranslation } from '../imports/i18n';
import useUrlState from '../imports/packages/use-url-state/index';
import { Solutions } from '../imports/project/solutions';

const useStyles = makeStyles(() => ({
  toolbar: {
    position: 'fixed',
    left: 0, top: 0,
    width: '100%', height: 60,
  },
  toolbarGrid: {
    height: '100%',
  },
  root: {
    position: 'absolute',
    left: 0, top: 60,
    width: '100%',
  },
}));

export default wrapPage(() => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [symptom, setSymptom] = useState('');

  return <>
    <Grid container className={classes.root} justify="center" alignItems="flex-start">
      <Grid item xs={11} sm={10} md={8} lg={7}>
        <Solutions symptomQuery={symptom}/>
      </Grid>
    </Grid>
    <Paper className={classes.toolbar}>
      <Grid container className={classes.toolbarGrid} justify="center" alignItems="center">
        <Grid item xs={11} sm={10} md={8} lg={7}>
          <TextField
            label={t('entrySymptom')}
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>
    </Paper>
  </>;
});
