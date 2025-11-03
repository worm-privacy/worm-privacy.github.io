import { ZodError } from 'zod';

/**
 * Formats a Zod validation error into a clear, readable error message
 * that can be thrown in a try/catch block.
 *
 * @param error - The Zod error to format
 * @returns A formatted error object with clear messages
 *
 * @example
 * ```typescript
 * try {
 *   const validatedData = mySchema.parse(inputData);
 *   // continue with validated data
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     throw formatZodError(error);
 *   }
 *   throw error;
 * }
 * ```
 */
export function formatZodError(error: ZodError): Error {
  const groupedIssues: Record<string, string[]> = {};
  error.issues.forEach((issue) => {
    const path = issue.path.length ? issue.path.join('.') : 'general';
    if (!groupedIssues[path]) {
      groupedIssues[path] = [];
    }
    groupedIssues[path].push(issue.message);
  });

  const formattedGroups = Object.entries(groupedIssues).map(([path, messages]) => {
    return `${path}:\n  - ${messages.join('\n  - ')}`;
  });

  const errorMessage =
    formattedGroups.length > 1
      ? `Validation failed in multiple fields:\n\n${formattedGroups.join('\n\n')}`
      : `Validation error: ${formattedGroups[0]}`;

  const formattedError = new Error(errorMessage);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (formattedError as any).zodError = error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (formattedError as any).isValidationError = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (formattedError as any).validationDetails = groupedIssues;

  return formattedError;
}
