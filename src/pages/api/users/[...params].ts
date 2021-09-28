import { NextApiRequest, NextApiResponse } from 'next';

const usersParams = (request: NextApiRequest, response: NextApiResponse) => {
  //console.log(request.query);

  const users = [
    { id: 1, name: 'Ariane' },
    { id: 2, name: 'Phoebe' },
    { id: 3, name: 'Lana' },
  ];

  return response.json(users);
}

export default usersParams;
