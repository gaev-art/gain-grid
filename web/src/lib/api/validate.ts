import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';
import { createApiError } from './errors';

export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: createApiError('BAD_REQUEST', error instanceof Error ? error.message : undefined),
    };
  }
}
