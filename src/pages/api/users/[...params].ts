import { NextApiRequest, NextApiResponse } from 'next';

export default (request: NextApiRequest, response: NextApiResponse) => {
  //console.log(request.query);

  const users = [
    { id: 1, name: 'Ariane' },
    { id: 2, name: 'Phoebe' },
    { id: 3, name: 'Lana' },
  ];

  return response.json(users);
}
