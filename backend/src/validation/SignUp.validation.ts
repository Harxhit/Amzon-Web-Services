import Joi from "joi";

const signUpSchema = Joi.object({
  username: Joi.string().min(4).required().messages({
    "string.empty": "username is required",
    "string.min": "username should atleast have 4 characters",
    "any.required": "username is required",
  }),
  firstName: Joi.string().min(2).required().messages({
     "string.empty": "firstname is required",
    "string.min": "firstname should atleast have 4 characters",
    "any.required": "firstname is required",
  }),
  lastName: Joi.string().min(2).required().messages({
    "string.empty": "lastname is required",
    "string.min": "lastname should atleast have 4 characters",
    "any.required": "lastname is required",
  }),
  email: Joi.string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .required()
    .messages({
      "string.pattern.base": "Please enter a valid email address",
      "string.empty": "email is required",
      "string.min": "Please enter a valid email address",
      "any.required": "email is required",
    }),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character",
        "string.empty": "password is required",
        "string.min": "password should atleast have 4 characters",
        "any.required": "password is required",
    }),
});

export default signUpSchema;
