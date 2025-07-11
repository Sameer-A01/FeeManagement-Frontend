import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Summary from "./components/Summary";
import AuthProvider from "./context/AuthContext";
import Root from "./utils/Root";
import ProtectedRoute from "./utils/ProtectedRoute";
import Products from "./components/Products";
import Categories from "./components/Categories";
import Suppliers from "./components/Suppliers";
import Users from "./components/Users";
import Logout from "./components/Logout";
import EmployeeProducts from "./components/EmployeeProducts";
import Orders from "./components/Orders";
import Profile from "./components/Profile";
import Courses from "./components/Courses";
import Students from "./components/Students";
import Feeplan from "./components/Feeplan";
import Feepayment from "./components/Feepayment";
import FeeSummary from "./components/FeeSummary";


const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute requiredRole={["admin"]}>
                <FeeSummary />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard/products"
            element={<Products />}
          ></Route>
          <Route
            path="/admin-dashboard/categories"
            element={<Categories />}
          ></Route>
          <Route
            path="/admin-dashboard/supplier"
            element={<Suppliers />}
          ></Route>
          <Route
            path="/admin-dashboard/courses"
            element={<Courses />}
          ></Route>
          <Route
            path="/admin-dashboard/students"
            element={<Students />}
          ></Route>
          <Route
            path="/admin-dashboard/Fee Plan"
            element={<Feeplan />}
          ></Route>
          <Route
            path="/admin-dashboard/Fee Payment"
            element={<Feepayment />}
          ></Route>
          <Route
            path="/admin-dashboard/Fee Summary"
            element={<FeeSummary />}
          ></Route>
          <Route
            path="/admin-dashboard/orders"
            element={
              <ProtectedRoute requiredRole={["admin"]}>
                <Orders />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/admin-dashboard/users" element={<Users />}></Route>
          <Route path="/admin-dashboard/profile" element={<Profile></Profile>}></Route>
        </Route>

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute requiredRole={["user"]}>
              <Dashboard></Dashboard>
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployeeProducts />}></Route>
          <Route path="orders" element={<Orders />}></Route>
          <Route path="profile" element={<Profile />}></Route>
        </Route>
        <Route path="/logout" element={<Logout />}></Route>
        <Route
          path="/unauthorized"
          element={<div>Unauthorized...</div>}
        ></Route>
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
