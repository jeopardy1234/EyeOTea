import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

import UsersList from "./components/users/UsersList";
import Home from "./components/common/Home";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" element={<Home />} />
          <Route path="users" element={<UsersList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
