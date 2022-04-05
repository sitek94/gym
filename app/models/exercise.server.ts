import type { Exercise, User } from '@prisma/client'

import { prisma } from '~/db.server'

export type { Exercise } from '@prisma/client'

export function getExercise({
  id,
  userId,
}: Pick<Exercise, 'id'> & {
  userId: User['id']
}) {
  return prisma.exercise.findFirst({
    where: { id, userId },
  })
}

export function getExerciseListItems({ userId }: { userId: User['id'] }) {
  return prisma.exercise.findMany({
    where: { userId },
    select: { id: true, name: true },
    orderBy: { updatedAt: 'desc' },
  })
}

export function createExercise({
  name,
  notes,
  userId,
}: Pick<Exercise, 'name' | 'notes'> & {
  userId: User['id']
}) {
  return prisma.exercise.create({
    data: {
      name,
      notes,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  })
}

export function deleteExercise({
  id,
  userId,
}: Pick<Exercise, 'id'> & { userId: User['id'] }) {
  return prisma.exercise.deleteMany({
    where: { id, userId },
  })
}
