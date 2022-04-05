import type { ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import * as React from 'react'

import { createExercise } from '~/models/exercise.server'
import { requireUserId } from '~/session.server'

type ActionData = {
  errors?: {
    name?: string
    notes?: string
  }
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)

  const formData = await request.formData()
  const name = formData.get('name')
  const notes = formData.get('notes')

  if (typeof name !== 'string' || name.length === 0) {
    return json<ActionData>(
      { errors: { name: 'Name is required' } },
      { status: 400 },
    )
  }

  if (typeof notes !== 'string' || notes.length === 0) {
    return json<ActionData>(
      { errors: { notes: 'Notes is required' } },
      { status: 400 },
    )
  }

  const exercise = await createExercise({ name, notes, userId })

  return redirect(`/exercises/${exercise.id}`)
}

export default function NewNotePage() {
  const actionData = useActionData() as ActionData
  const nameRef = React.useRef<HTMLInputElement>(null)
  const notesRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus()
    } else if (actionData?.errors?.notes) {
      notesRef.current?.focus()
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
          <span>Name: </span>
          <input
            ref={nameRef}
            name="name"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-errormessage={
              actionData?.errors?.name ? 'title-error' : undefined
            }
          />
        </label>
        {actionData?.errors?.name && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.name}
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
