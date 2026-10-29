import { seedData } from '../../../Data/Mock';

export const usuarios = seedData.users;

export const getUsuarioByEmail = (email) => {
  return usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

export const getUsuarioById = (id) => {
  return usuarios.find((u) => u.id === id);
};
