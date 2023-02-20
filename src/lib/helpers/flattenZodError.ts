import { typeToFlattenedError } from 'zod';

/**
 * Flatten more of Zod's flattened error type.
 * This make sures everything is inline with the rest of the app, including form errors.
 * This function will only take the first error for each field.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function flattenZodError<T extends typeToFlattenedError<any>>(
  errors: T,
) {
  return Object.entries(errors.fieldErrors).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value?.[0] }),
    { $form: errors.formErrors[0] },
  ) as Partial<Record<keyof T['fieldErrors'], string>> & { $form?: string };
}
