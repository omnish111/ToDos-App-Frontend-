export const isEmailValid = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

export const validateRegisterForm = ({ name, email, password }) => {
  const errors = {};

  if (!name.trim()) errors.name = "Name is required";
  else if (name.trim().length < 2)
    errors.name = "Name must be at least 2 characters";

  if (!email.trim()) errors.email = "Email is required";
  else if (!isEmailValid(email)) errors.email = "Please enter a valid email";

  if (!password) errors.password = "Password is required";
  else if (password.length < 6)
    errors.password = "Password must be at least 6 characters";

  return errors;
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email.trim()) errors.email = "Email is required";
  else if (!isEmailValid(email)) errors.email = "Please enter a valid email";

  if (!password) errors.password = "Password is required";

  return errors;
};

export const validateTaskForm = ({ title }) => {
  const errors = {};

  if (!title.trim()) errors.title = "Task title is required";
  else if (title.trim().length < 2)
    errors.title = "Task title must be at least 2 characters";

  return errors;
};
