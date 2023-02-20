import apiHandler from '@/lib/apiHandler';
import database from '@/lib/database';
import Hash from '@/lib/hash';
import flattenZodError from '@/lib/helpers/flattenZodError';
import { sign } from 'jsonwebtoken';
import { pick } from 'lodash-es';
import { z } from 'zod';
import { setCookie } from 'cookies-next';

const validator = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({
      message: 'Invalid email address',
    }),
  password: z.string({
    required_error: 'Password is required',
  }),
});

export default apiHandler().post(async (req, res) => {
  const validated = await validator.safeParseAsync(req.body);

  if (!validated.success) {
    const errors = validated.error.flatten();

    return res.status(422).json({
      message: 'Invalid request body',
      errors: flattenZodError(errors),
    });
  }

  const { email, password } = validated.data;

  const user = await database.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).json({
      message: 'Invalid credentials',
      errors: {
        email: 'User not found',
      },
    });
  }

  const isPasswordValid = await Hash.verifyFromStoredHash(
    password,
    user.password,
  );

  if (!isPasswordValid) {
    return res.status(401).json({
      message: 'Invalid credentials',
      errors: {
        password: 'Wrong password',
      },
    });
  }

  const token = sign(
    pick<JwtUser>(user, ['id', 'email', 'username', 'createdAt', 'editedAt']),
    process.env.JWT_SECRET,
    {
      subject: user.id,
    },
  );

  setCookie('token', token, {
    httpOnly: true,
    req,
    res,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  return res.status(200).json({
    message: 'Login successful',
  });
});
