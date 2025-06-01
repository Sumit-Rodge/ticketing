import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { validateRequest } from '@sumit-r/tic-common';
// import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '@sumit-r/tic-common';
// import { BadRequestError } from '../errors/bad-request-error';
import { PasswordManager } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await PasswordManager.compare(
      existingUser.password,
      password
    );

    // console.log(`passwrod match is: ${passwordMatch}`);
    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    //Generate JWtdf
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    //Store JWT on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(existingUser);
  }
);

export { router as signinRouter };
