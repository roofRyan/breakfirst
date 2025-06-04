import prisma from "@/lib/prisma";
import { addTodo, deleteTodo, toggleTodo} from "@/app/actions/todo";

export default async function TodoPage(){
    const todos = await prisma.todo.findMany({
        orderBy: { id: "asc"},
    });
    return (
        <main className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center my-6">Todo List</h1>
            <form action={addTodo} className="mb-4">
                <input type="text" name="title" placeholder="Add a new todo" className="shadow appearance-none border rounded py-2 px-3 mr-2 text-black"/>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Todo</button>
            </form>
            <ul>
                {todos.map((todo)=>(
                    <li key={todo.id} className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded shadow my-2">
                        <span className={`${todo.done ? "line-through" : ""} text-lg `}>{todo.title}</span>
                        <div>
                        <div className="flex flex-wrap gap-2">
                        <form action={toggleTodo}>
                            <input type="hidden" name="id" value={todo.id}/>
                            <input type="hidden" name="done" value={todo.done} />
                            <button type="submit" className="bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">{todo.done ? "Undo" : "Done"}</button>
                        </form>
                        <form action={deleteTodo}>
                            <input type="hidden" name="id" id={todo.id} value={todo.id}/>
                            <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                        </form>
                        </div>
                        </div>
                    </li>
                ))}
            </ul>
        </main>
    );
}