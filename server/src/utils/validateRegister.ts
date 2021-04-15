import { UsernamePasswordInput } from 'src/resolvers/usernamePasswordInput';

export const validateRegister = (options: UsernamePasswordInput) => {
  if (options.username.length <= 2) {
    return [
      {
        field: 'username',
        message: 'Username length must be greater than 2',
      },
    ];
  }

  if (options.password.length <= 5) {
    return [
      {
        field: 'password',
        message: 'Password length must be greater than 5',
      },
    ];
  }

  if (!options.email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'Invalid email',
      },
    ];
  }

  if (options.username.includes('@')) {
    return [
      {
        field: 'username',
        message: 'Cannot include an "@" character',
      },
    ];
  }

  return null;
};
