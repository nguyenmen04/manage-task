import { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import TaskStats from './components/tasks/TaskStats';
import TaskForm from './components/tasks/TaskForm';
import TaskList from './components/tasks/TaskList';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { fetchTasks, addTask, toggleTask, deleteTask } from './services/api';

// Component để bảo vệ các route yêu cầu đăng nhập
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Component chính của ứng dụng quản lý Task (Chỉ hiện khi đã login)
const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async (title) => {
    try {
      const newTask = await addTask(title);
      setTasks([newTask, ...tasks]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleTask = async (id, currentStatus) => {
    try {
      const updatedTask = await toggleTask(id, currentStatus);
      setTasks(tasks.map(t => (t.id === id ? { ...t, status: updatedTask.status } : t)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Tasks Overview</h2>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                <TaskStats tasks={tasks} />
                <TaskForm onAdd={handleAddTask} />
                <TaskList 
                  tasks={tasks} 
                  onToggle={handleToggleTask} 
                  onDelete={handleDeleteTask} 
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
