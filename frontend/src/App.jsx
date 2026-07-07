import { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import TaskStats from './components/tasks/TaskStats';
import TaskForm from './components/tasks/TaskForm';
import TaskList from './components/tasks/TaskList';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { fetchTasks, addTask, updateTask, deleteTask } from './services/api';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await addTask(taskData);
      setTasks([newTask, ...tasks]);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
      console.error(error);
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const updated = await updateTask(id, updates);
      setTasks(tasks.map(t => (t.id === id ? { ...t, ...updated } : t)));
      if (updates.status !== undefined) {
        toast.success(updates.status ? 'Task completed!' : 'Task reopened');
      } else {
        toast.success('Task updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update task');
      console.error(error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen mesh-bg font-sans text-slate-800">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-900 drop-shadow-sm">Tasks Overview</h2>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="animate-fade-in-up">
                <TaskStats tasks={tasks} />
                <TaskForm onAdd={handleAddTask} />
                <TaskList 
                  tasks={tasks} 
                  onUpdate={handleUpdateTask} 
                  onDelete={handleDeleteTask} 
                />
              </div>
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
        <Toaster position="top-right" />
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
