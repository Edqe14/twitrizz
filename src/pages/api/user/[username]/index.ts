/* eslint-disable @typescript-eslint/indent */
import apiHandler from '@/lib/apiHandler';
import { IMAGE_MIMETYPES } from '@/lib/constants';
import database from '@/lib/database';
import firebase from '@/lib/firebase';
import flattenZodError from '@/lib/helpers/flattenZodError';
import resolveUsernameFromRequest from '@/lib/helpers/resolveUsernameFromRequest';
import { File, IncomingForm } from 'formidable';
import { readFile } from 'fs/promises';
import { z } from 'zod';

const uploadHandler = new IncomingForm({
  maxFileSize: 20 * 1024 * 1024, // 20MB
});

const updateValidator = z.object({
  bio: z.string().max(250).optional(),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiHandler(['verifyJwt'])
  .get(async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const username = resolveUsernameFromRequest(req)!;

    const user = await database.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        image: true,
        bio: true,
        username: true,
        createdAt: true,
        ...(req.query.username === '@me'
          ? {
              email: true,
            }
          : {}),
      },
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      message: 'User found',
      user,
    });
  })
  .put(async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const username = resolveUsernameFromRequest(req)!;
    const user = await database.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    uploadHandler.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({
          message: 'Failed to upload image',
        });
      }

      const validated = await updateValidator.safeParseAsync(fields);
      if (!validated.success) {
        return res.status(422).json({
          message: 'Invalid request',
          errors: flattenZodError(validated.error.flatten()),
        });
      }

      const data: { bio?: string; image?: string } = {
        bio: validated.data.bio,
      };

      const image = files.image as File;

      if (image && IMAGE_MIMETYPES.includes(image.mimetype as string)) {
        const buffer = await readFile(image.filepath);
        const url = await firebase.uploadFile(
          `users/${user.id}/image.jpg`,
          buffer,
        );

        data.image = url;
      }

      try {
        const updated = await database.user.update({
          where: {
            id: user.id,
          },
          data,
          select: {
            id: true,
            image: true,
            bio: true,
            username: true,
            createdAt: true,
            ...(req.query.username === '@me'
              ? {
                  email: true,
                }
              : {}),
          },
        });

        return res.status(200).json({
          message: 'User updated',
          user: updated,
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        return res.status(500).json({
          message: 'Failed to update user',
        });
      }
    });
  });
