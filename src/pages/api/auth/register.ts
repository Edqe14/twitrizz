import apiHandler from '@/lib/apiHandler';
import database from '@/lib/database';
import Hash from '@/lib/hash';
import flattenZodError from '@/lib/helpers/flattenZodError';
import { setCookie } from 'cookies-next';
import { sign } from 'jsonwebtoken';
import { pick } from 'lodash-es';
import { z } from 'zod';

const validator = z.object({
  username: z
    .string({
      required_error: 'Username is required',
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers and underscores',
    })
    .min(3, {
      message: 'Username must be at least 3 characters long',
    }),
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

  const { email, password, username } = validated.data;

  if (
    await database.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    })
  ) {
    return res.status(403).json({
      message: 'Email already in use',
      errors: {
        email: 'Email already in use',
      },
    });
  }

  if (
    await database.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    })
  ) {
    return res.status(403).json({
      message: 'Username already taken',
      errors: {
        username: 'Username already taken',
      },
    });
  }

  const hash = await Hash.hash(password);
  const user = await database.user.create({
    data: {
      email,
      password: hash.toString(),
      username,
    },
  });

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
    message: 'Register successful',
  });
});
