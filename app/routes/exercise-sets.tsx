import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, NavLink, Outlet, useLoaderData } from '@remix-run/react'

import { requireUserId } from '~/session.server'
import { getExerciseListItems } from '~/models/exercise.server'

type LoaderData = {
  exerciseListItems: Awaited<ReturnType<typeof getExerciseListItems>>
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const exerciseListItems = await getExerciseListItems({ userId })
  return json<LoaderData>({ exerciseListItems })
}

export default function ExercisesPage() {
  const data = useLoaderData() as LoaderData

  return (
    <main className="flex h-full bg-white">
      <div className="h-full w-80 border-r bg-gray-50">
        <Link to="new" className="block p-4 text-xl text-blue-500">
          + New Exercise
        </Link>

        <hr />

        {data.exerciseListItems.length === 0 ? (
          <p className="p-4">No exercises yet</p>
        ) : (
          <ol>
            {data.exerciseListItems.map(exercise => (
              <li key={exercise.id}>
                <NavLink
                  className={({ isActive }) =>
                    `block border-b p-4 text-xl ${isActive ? 'bg-white' : ''}`
                  }
                  to={exercise.id}
                >
                  {exercise.name}
                </NavLink>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </main>
  )
}
