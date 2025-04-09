import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "../pages/Main.jsx";
import { WelcomeWithNavigation } from "../utils/navigation.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import { AuthProvider } from "../utils/AuthContext.jsx";
import NewPub from "../pages/NewPub.jsx";
import Post from "../pages/Post.jsx";

function App() {
  <WelcomeWithNavigation />;

  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<WelcomeWithNavigation />} />
            <Route path="/main" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/newpub" element={<NewPub />} />
            <Route path="/posts/:id" element={<Post />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
