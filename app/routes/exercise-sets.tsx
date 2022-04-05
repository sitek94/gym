import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, NavLink, Outlet, useLoaderData } from '@remix-run/react'

import { requireUserId } from '~/session.server'
import { getExerciseSetListItems } from '~/models/exercise-set.server'

type LoaderData = {
  exerciseSetListItems: Awaited<ReturnType<typeof getExerciseSetListItems>>
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const exerciseSetListItems = await getExerciseSetListItems({ userId })
  return json<LoaderData>({ exerciseSetListItems })
}

export default function ExercisesPage() {
  const data = useLoaderData() as LoaderData

  return (
    <main className="flex h-full bg-white">
      <div className="h-full w-80 border-r bg-gray-50">
        <Link to="new" className="block p-4 text-xl text-blue-500">
          + New Set
        </Link>

        <hr />

        {data.exerciseSetListItems.length === 0 ? (
          <p className="p-4">No sets yet</p>
        ) : (
          <ol>
            {data.exerciseSetListItems.map(exerciseSet => (
              <li key={exerciseSet.id}>
                <NavLink
                  className={({ isActive }) =>
                    `block border-b p-4 text-xl ${isActive ? 'bg-white' : ''}`
                  }
                  to={exerciseSet.id}
                >
                  {new Date(exerciseSet.date).toLocaleDateString()}&mdash;
                  {exerciseSet.reps} {exerciseSet.exercise.name}
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
