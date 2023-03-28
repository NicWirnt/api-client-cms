import Joi from "joi";

const validator = (schema, req, res, next) => {
  const { value, error } = schema.validate(req.body);
  if (error) {
    error.status = 200;
    return next(error);
  }

  next();
};

export const newUserValidation = (req, res, next) => {
  const schema = Joi.object({
    fName: Joi.string().alphanum().required().min(3).max(30),
    lName: Joi.string().required().min(3).max(30),
    phone: Joi.string().required().min(10).max(15),
    password: Joi.string().required().min(6),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
  });

  validator(schema, req, res, next);
};

//email validation
export const emailVerificaitonValidaiton = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    emailValidationCode: Joi.string().required(),
  });

  validator(schema, req, res, next);
};
