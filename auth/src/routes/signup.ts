import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
// import { BadRequestError } from '../errors/bad-request-error';
import { BadRequestError } from '@sumit-r/tic-common';
import jwt from 'jsonwebtoken';
// import { validateRequest } from '../middlewares/validate-request';
import { validateRequest } from '@sumit-r/tic-common';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Password must be 4-20 character'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email is already in use');
    }

    const user = User.build({ email, password });

    await user.save();

    //Generate JWtdf
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    //Store JWT on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
