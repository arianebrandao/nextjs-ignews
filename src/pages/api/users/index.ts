import { NextApiRequest, NextApiResponse } from 'next';

// Técnicas de autenticação
// - JWT (storage)
// - Next Auth (Social)
// - 3rd party (Cognito, Auth0)

export default (request: NextApiRequest, response: NextApiResponse) => {
  const users = [
    { id: 1, name: 'Ariane' },
    { id: 2, name: 'Phoebe' },
    { id: 3, name: 'Lana' },
  ];

  return response.json(users);
}
