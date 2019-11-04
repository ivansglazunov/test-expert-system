// @flow

import _ from 'lodash';
import natural from 'natural';
import { generateApolloClient } from '../../imports/packages/gql';
import gql from 'graphql-tag';

const apolloClient = generateApolloClient({}, {
  secret: _.get(process, 'env.GQL_SECRET'),
  path: _.get(process, 'env.GQL_PATH'),
});

natural.PorterStemmer.attach();

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

export default async (req: any, res: any) => {
  const tokens = req.query.query.tokenizeAndStem();
  const result = await apolloClient.query({ query: QUERY, variables: { where: { _or: tokens.map(str => ({ value: { _like: `%${str}%` } })) } } });
  res.send(result.data);
};
