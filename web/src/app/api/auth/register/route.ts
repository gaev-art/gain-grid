import { createApiError } from '@/lib/api/errors';
import { validateRequest } from '@/lib/api/validate';
import { hashPassword } from '@/lib/auth-utils';
import { registerSchema } from '@/lib/forms/register-schema';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { data, error } = await validateRequest(request, registerSchema);
    if (error) return error;

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return createApiError('BAD_REQUEST', 'Email already registered');
    }

    const hashedPassword = await hashPassword(data.password);

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return createApiError('SERVER_ERROR', error instanceof Error ? error.message : undefined);
  }
}
