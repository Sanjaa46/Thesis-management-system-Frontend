import React, { useState, useEffect } from "react";
import axios from 'axios';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./Main.css";

// Import components
import DeFormSet from "./department/DeFormSet";
import StudentList from "./department/StudentList";
import ConfirmedTopicStud from "./student/ConfirmedTopiclist";
import ProposeTopicStud from "./student/ProposeTopicStud";
import TopicListStud from "./student/TopicListStud";
import ApprovedTopics from "./supervisor/ApprovedTopics";
import ProposedTopics from "./supervisor/ProposedTopics";
import ConfirmedTopics from "./teacher/ConfirmedTopics";
import ProposeTopic from "./teacher/ProposeTopic";
import TopicList from "./teacher/TopicList";
import SideBar from "../components/navbar/SideBar";
import CustomNavBar from "../components/navbar/CustomNavBar";

function Main({ setUser, logoutFunction }) {
  const { user } = useUser();
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    // Check role when component mounts if user is logged in
    if (user && !user.role) {
      checkUserRole();
    }
  }, [user]);

  const checkUserRole = async () => {
    setRoleLoading(true);
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('oauth_token');
      
      if (!token) {
        console.error('No authentication token found');
        setRoleLoading(false);
        return;
      }
      
      const response = await axios.get('http://127.0.0.1:8000/api/user/role', {
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        const roleData = response.data.data;
        // Update user with role information
        setUser(prev => ({
          ...prev,
          role: roleData.roleName,
          gid: roleData.gid
        }));
        console.log('Role detected:', roleData.roleName);
      }
    } catch (error) {
      console.error('Error checking role:', error);
      
      // If we get 401, try to redirect to login
      if (error.response && error.response.status === 401) {
        console.log('Authentication failed, user may need to log in again');
        // You could redirect to login here if needed
      }
    } finally {
      setRoleLoading(false);
    }
  };

  // Determine user role
  let userRole = "";
  
  if (user?.email === "department@gmail.com" || user?.gid === "78") {
    userRole = "department";
  } else if (user?.email === "supervisor@gmail.com" || user?.gid === "90") {
    userRole = "supervisor";
  } else if (user?.email === "student@gmail.com" || user?.gid === "5") {
    userRole = "student";
  } else if (user?.email === "teacher@gmail.com" || user?.gid === "70") {
    userRole = "teacher";
  }

  // Define routes based on user role
  const getRoutes = () => {
    switch (userRole) {
      case "department":
        return (
          <>
            <Route index element={<StudentList />} />
            <Route path="/studentlist" element={<StudentList />} />
            <Route path="/deformset" element={<DeFormSet />} />
          </>
        );
      case "supervisor":
        return (
          <>
            <Route index element={<ProposedTopics />} />
            <Route path="/proposedtopics" element={<ProposedTopics />} />
            <Route path="/approvedtopics" element={<ApprovedTopics />} />
          </>
        );
      case "student":
        return (
          <>
            <Route index element={<TopicListStud />} />
            <Route path="/topicliststud" element={<TopicListStud />} />
            <Route path="/proposetopicstud" element={<ProposeTopicStud />} />
            <Route path="/confirmedtopic" element={<ConfirmedTopicStud />} />
          </>
        );
      case "teacher":
        return (
          <>
            <Route index element={<TopicList />} />
            <Route path="/topiclist" element={<TopicList />} />
            <Route path="/proposetopics" element={<ProposeTopic />} />
            <Route path="/confirmedtopics" element={<ConfirmedTopics />} />
          </>
        );
      default:
        return (
          <Route index element={
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">Welcome</h2>
                <p>Your role is not defined. Please contact an administrator.</p>
              </div>
            </div>
          } />
        );
    }
  };

  const handleMenuToggle = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  return (
    <div className="app-layout">
      <CustomNavBar 
        user={user} 
        setUser={setUser} 
        logoutFunction={logoutFunction} 
        onClick={handleMenuToggle} 
      />
      <div className="content">
        <SideBar user={user} collapsed={menuCollapsed} />
        <div className="routes-content">
          <Routes>
            {getRoutes()}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Main;