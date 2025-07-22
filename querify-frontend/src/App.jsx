import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AskQuestionPage from "./pages/AskQuestionPage";
import QuestionPage from "./pages/QuestionPAge";
import DashboardPage from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import  Layout  from "./components/LayOut";


function App() {
  return (
    <>
    <Layout >
    <Navbar />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          
            <HomePage />
          
        }
      />

      <Route
        path="/ask"
        element={
          <ProtectedRoute>
            <AskQuestionPage />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}></Route>

      <Route path="/question/:id" element={<QuestionPage />} />
    </Routes>
    </Layout>
    </>
  );
}

export default App;
