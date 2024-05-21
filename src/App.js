import './App.css';
import { useState, useRef } from 'react'
import { v4 as uuidv4 } from "uuid"

import Calender from './Calendar'
import TodoList from './TodoList'

function App() {
  // 今日の日付
  const today = new Date();
  // 表示するリスト
  const [todos, setTodos] = useState([]);
  // カレンダーコンポーネントで選択された日付
  const [selectedDate, setSelectedDate] = 
    useState(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);
  // データベースから取得してきたタスク情報
  const [tasks, setTasks] = useState([]);

  // 
  const todoNameRef = useRef();

  
  const fetchTaskData = () => {
    fetch('http://localhost:8080/tasks')
      .then(response => response.json())
      .then(tasks => {
        // selectedDateと同じ日付を持つタスクのみをフィルタリングする
        const filteredTasks = tasks.filter(task => {
          // tasks内の各タスクの日付を取得し、selectedDateと比較する
          const taskDate = new Date(task.date); // taskの日付をDateオブジェクトに変換する
          const selectedDateObj = new Date(selectedDate); // selectedDateをDateオブジェクトに変換する
          return taskDate.toDateString() === selectedDateObj.toDateString(); // 日付が一致する場合のみtrueを返す
        });
  
        setTasks(filteredTasks);
        console.log(filteredTasks);
        setTodos(filteredTasks); // オリジナルのtasksではなく、フィルタリングされたtasksをセットする
      })
      .catch(error => {
        console.error('Error fetching tasks data:', error);
        setTasks([]);
      });
  }
  
  const addTaskToDatabase = (task) => {
    fetch('http://localhost:8080/tasks/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
    .then(response => response.json())
    .then(newTask => {
      console.log('New task added:', newTask);
      // タスクが追加されたら、追加されたタスクをフロントエンドの状態に反映するなどの処理を行う
      setTodos(prevTodos => [...prevTodos, newTask]);
    })
    .catch(error => {
      console.error('Error adding task:', error);
    });
  };
  


  // タスクの完了チェック関数
  // 引数 id ... どのタスクにチェックを入れるか
  const toggleTodo = (id) => {
    const newTodos = [...todos];
    const todo = newTodos.find((todo) => todo.id === id);
    todo.completed = !todo.completed;
    setTodos(newTodos);
  }


// フォームから送信された際の処理
const handleSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const newStock = {
    name: formData.get('name'),
    date: new Date(selectedDate)
  };
  addTaskToDatabase(newStock);
}




  return (
    <main>
      <Calender today={today} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            タスク名:
            <input type="text" name="name" required ref={todoNameRef} />
            <button type="submit">タスクを追加</button>
          </label>
        </form>


        <button onClick={fetchTaskData}>タスクを取得</button>
        {/* <button onClick={handleAddTodo}>タスクを追加</button> */}
        <div>残りのタスク:{todos.filter((todo) => !todo.completed).length}</div>
        <p>タスクリスト</p>
        <TodoList todos = {todos} toggleTodo={toggleTodo} />
      </div>
    </main>
  );
}

export default App;






  // // タスク追加関数
  // const handleAddTodo = () => {
  //   const name = todoNameRef.current.value;
  
  //   // タスク名が無ければ追加しない
  //   if(name === "") return;
    
  //   console.log(new Date(selectedDate));
  //   const newTask = { id: uuidv4(), name: name};
  //   console.log(newTask.date);
  //   addTaskToDatabase(newTask);
  //   todoNameRef.current.value = null;
  // };

  // {/* <button onClick={handleClear}>タスクを削除</button> */} 

  // // 完了済みタスク削除関数
  // const handleClear = () => {
  //   const newTodos = todos.filter((todo) => !todo.completed);
  //   setTodos(newTodos);
  // }