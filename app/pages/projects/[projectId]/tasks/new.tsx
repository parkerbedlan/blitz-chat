import { Link, useRouter, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createTask from "app/tasks/mutations/createTask"
import { TaskForm, FORM_ERROR } from "app/tasks/components/TaskForm"

const NewTaskPage: BlitzPage = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [createTaskMutation] = useMutation(createTask)

  return (
    <div>
      <h1>Create New Task</h1>

      <TaskForm
        submitText="Create Task"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateTask}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const task = await createTaskMutation({ ...values, projectId: projectId! })
            router.push(Routes.ShowTaskPage({ projectId: projectId!, taskId: task.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.TasksPage({ projectId: projectId! })}>
          <a>Tasks</a>
        </Link>
      </p>
    </div>
  )
}

NewTaskPage.authenticate = true
NewTaskPage.getLayout = (page) => <Layout title={"Create New Task"}>{page}</Layout>

export default NewTaskPage
