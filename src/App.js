import './App.css';
import {Routes,Route} from "react-router-dom";
import Login from './components/Login';
import Signup from './components/Signup';
import {UserAuthContextProvider} from './context/UserAuthContext';
import ProtectedRoute from "./components/ProtectedRoute";
import Home from '../src/components/HOME/Home';
import AdminApp from './components/ADMIN/AdminApp';
import EditForm from './components/ADMIN/EditForm/EditForm';

function App() {
  return (
    <div className="App">
      <UserAuthContextProvider>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <ProtectedRoute>
          <>
          <Route path='/admin' element={<AdminApp />} />
          <Route path='/edit/:id' element={<EditForm />} />
          <Route path='/home' element={<Home /> } /> 
            </>
              </ProtectedRoute>
         
        </Routes>
      </UserAuthContextProvider>
    </div>
  );
}

export default App;
