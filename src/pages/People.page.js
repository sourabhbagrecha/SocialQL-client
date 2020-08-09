import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Person from '../components/Person.component';

const GET_PEOPLE = gql`
  query users{
    users{
      _id
      name
      email
    }
  }
`;

const renderUser = user => <Person {...user} />;

function People(props) {
  const { data, loading, error } = useQuery(GET_PEOPLE);
  if(loading) return `Loading...`;
  if(error) return error;

  return (
    data.users.map(renderUser)  
  )
};

export default People
