import useRequest from '../../hooks/use-request';
import Router from 'next/router';
import React, { useEffect } from 'react';

const Signout = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);
  return <div>signout</div>;
};

export default Signout;
