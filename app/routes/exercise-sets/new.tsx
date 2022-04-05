import type { ActionFunction } from '@remix-run/node'
import { json, LoaderFunction, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import * as React from 'react'
import { requireUserId } from '~/session.server'
import { createExerciseSet } from '~/models/exercise-set.server'
import { getExerciseListItems } from '~/models/exercise.server'

type ActionData = {
  errors?: {
    name?: string
    date?: string
    notes?: string
    reps?: string
    weight?: string
    exerciseId?: string
  }
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)

  const formData = await request.formData()
  const date = formData.get('date')
  const notes = formData.get('notes')
  const reps = formData.get('reps')
  const weight = formData.get('weight')
  const exerciseId = formData.get('exerciseId')

  if (typeof date !== 'string' || date.length === 0) {
    return json<ActionData>(
      { errors: { name: 'Name is required' } },
      { status: 400 },
    )
  }

  if (notes && typeof notes !== 'string') {
    return json<ActionData>(
      { errors: { notes: 'Notes must be a string' } },
      { status: 400 },
    )
  }

  if (typeof exerciseId !== 'string' || exerciseId.length === 0) {
    return json<ActionData>(
      { errors: { notes: 'Exercise ID is required' } },
      { status: 400 },
    )
  }

  if (typeof reps !== 'string' || reps.length === 0) {
    return json<ActionData>(
      { errors: { notes: 'Reps is required' } },
      { status: 400 },
    )
  }

  if (typeof weight !== 'string' || weight.length === 0) {
    return json<ActionData>(
      { errors: { notes: 'Reps is required' } },
      { status: 400 },
    )
  }

  const exerciseSet = await createExerciseSet({
    date: new Date(date),
    notes,
    userId,
    reps: Number(reps),
    weight: Number(weight),
    exerciseId,
  })

  return redirect(`/exercise-sets/${exerciseSet.id}`)
}

type LoaderData = {
  exerciseListItems: Awaited<ReturnType<typeof getExerciseListItems>>
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const exerciseListItems = await getExerciseListItems({ userId })
  return json<LoaderData>({ exerciseListItems })
}

export default function NewExercisePage() {
  const data = useLoaderData() as LoaderData
  const actionData = useActionData() as ActionData

  const nameRef = React.useRef<HTMLInputElement>(null)
  const dateRef = React.useRef<HTMLInputElement>(null)
  const notesRef = React.useRef<HTMLTextAreaElement>(null)
  const repsRef = React.useRef<HTMLInputElement>(null)
  const weightRef = React.useRef<HTMLInputElement>(null)
  const exerciseIdRef = React.useRef<HTMLSelectElement>(null)

  React.useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus()
    } else if (actionData?.errors?.notes) {
      notesRef.current?.focus()
    } else if (actionData?.errors?.date) {
      dateRef.current?.focus()
    } else if (actionData?.errors?.reps) {
      repsRef.current?.focus()
    } else if (actionData?.errors?.weight) {
      weightRef.current?.focus()
    } else if (actionData?.errors?.exerciseId) {
      exerciseIdRef.current?.focus()
    }
  }, [actionData])

  return (
    <Form
      method="post"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%',
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Exercise: </span>
          <select
            ref={exerciseIdRef}
            name="exerciseId"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-loose"
            aria-invalid={actionData?.errors?.date ? true : undefined}
            aria-errormessage={
              actionData?.errors?.date ? 'date-error' : undefined
            }
          >
            {data.exerciseListItems.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        {actionData?.errors?.date && (
          <div className="pt-1 text-red-700" id="date-error">
            {actionData.errors.date}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Reps: </span>
          <input
            ref={repsRef}
            type="number"
            name="reps"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.reps ? true : undefined}
            aria-errormessage={
              actionData?.errors?.reps ? 'reps-error' : undefined
            }
          />
        </label>
        {actionData?.errors?.reps && (
          <div className="pt-1 text-red-700" id="reps-error">
            {actionData.errors.reps}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Weight: </span>
          <input
            ref={weightRef}
            type="number"
            name="weight"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.weight ? true : undefined}
            aria-errormessage={
              actionData?.errors?.weight ? 'weight-error' : undefined
            }
          />
        </label>
        {actionData?.errors?.weight && (
          <div className="pt-1 text-red-700" id="weight-error">
            {actionData.errors.weight}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Date: </span>
          <input
            ref={dateRef}
            type="datetime-local"
            name="date"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.date ? true : undefined}
            aria-errormessage={
              actionData?.errors?.date ? 'date-error' : undefined
            }
          />
        </label>
        {actionData?.errors?.date && (
          <div className="pt-1 text-red-700" id="date-error">
            {actionData.errors.date}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Notes: </span>
          <textarea
            ref={notesRef}
            name="notes"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={actionData?.errors?.notes ? true : undefined}
            aria-errormessage={
              actionData?.errors?.notes ? 'body-error' : undefined
            }
          />
        </label>
        {actionData?.errors?.notes && (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.notes}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  )
}
