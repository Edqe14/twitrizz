import { NextApiResponse } from 'next';
import SuperJSON from 'superjson';

const useSuperjson = (res: NextApiResponse) => {
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(SuperJSON.stringify(data));
  };
};

export default useSuperjson;
