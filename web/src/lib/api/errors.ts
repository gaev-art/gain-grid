import { NextResponse } from 'next/server';

type ErrorType = 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'SERVER_ERROR';

const ERROR_CODES: Record<ErrorType, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

export function createApiError(type: ErrorType, devMessage?: string) {
  if (process.env.NODE_ENV === 'development') {
    console.error(`API Error (${type}):`, devMessage);
  }

  return NextResponse.json({ success: false }, { status: ERROR_CODES[type] });
}
