import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Switch, Route} from "react-router-dom"
import AdminComponent from "./Components/AdminComponents";
import LoginComponent from "./Components/LoginPage";
import HomeComponent from "./Components/Home";

function App() {
  return (
   <Switch>
       <Route exact path="/login">
           <LoginComponent />
       </Route>
     <Route path="/admin">
       <AdminComponent />
     </Route>
       <Route path="/">
         <HomeComponent/>
       </Route>

   </Switch>
  );
}

export default App;
