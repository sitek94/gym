import type { ExerciseSet, User } from '@prisma/client'

import { prisma } from '~/db.server'

export type { ExerciseSet } from '@prisma/client'

export function getExerciseSet({
  id,
  userId,
}: Pick<ExerciseSet, 'id'> & {
  userId: User['id']
}) {
  return prisma.exerciseSet.findFirst({
    where: { id, userId },
  })
}

export function getExerciseSetListItems({ userId }: { userId: User['id'] }) {
  return prisma.exerciseSet.findMany({
    where: { userId },
    select: { id: true, date: true },
    orderBy: { date: 'desc' },
  })
}

export function createExerciseSet({
  date,
  reps,
  weight,
  notes,
  exerciseId,
  userId,
}: Pick<ExerciseSet, 'reps' | 'weight' | 'notes' | 'date' | 'exerciseId'> & {
  userId: User['id']
}) {
  return prisma.exerciseSet.create({
    data: {
      date,
      reps,
      weight,
      notes,
      user: {
        connect: {
          id: userId,
        },
      },
      exercise: {
        connect: {
          id: exerciseId,
        },
      },
    },
  })
}

export function deleteExerciseSet({
  id,
  userId,
}: Pick<ExerciseSet, 'id'> & { userId: User['id'] }) {
  return prisma.exercise.deleteMany({
    where: { id, userId },
  })
}
