import useToken from "@galvanize-inc/jwtdown-for-react";
import { useState } from "react";
import React, { useEffect, useState } from 'react';
// import {useNavigate} from 'react-router-dom';

const initialAccountData = {
    username:"",
    password:"",
}

const initialUserData = {
    first_name: "",
    last_name: "",
    email:"",
    icon_id:""
}

function SignUpForm(){
    const navigate = useNavigate();

    const [accountFormData, setAccountFormData] = useState(initialAccountData);
    const [userFormData, setUserFormData] = useState(initialUserData);

    const fetchData = async () => {
        const url = 'http://localhost:8000/api/icons/';
    }

    const handleFormChange = (e) => {
        setAccountFormData({
            ...accountFormData,
            [e.target.name]:e.target.value
        })
        setUserFormData({
            ...userFormData,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const accountUrl = 'http://localhost:8000/api/accounts'

        const accountFetchConfig = {
            method: "post",
            body: JSON.stringify(accountFormData),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const account_response = await fetch(accountUrl, accountFetchConfig);
        if (account_response.ok) {
            // navigate("/accounts");
            setAccountFormData(initialAccountData);
        } else {
            throw new Error('Failed to create account')
        }
        const userUrl = 'http://localhost:8000/api/users'

        const userFetchConfig = {
            method: "post",
            body: JSON.stringify(userFormData),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const user_response = await fetch(userUrl, userFetchConfig);
        if (user_response.ok) {
            // navigate("/accounts");
            setUserFormData(initialUserData);
        } else {
            throw new Error('Failed to create user')
        }
    }
    return (
    <div className="container">
      <div className="row">
        <div className="offset-3 col-6">
          <div className="shadow p-4 mt-4">
            <h1>Create a profile</h1>
            <form onSubmit={handleSubmit} id="create-profile">
              <div className="form-floating mb-3">
                <label htmlFor="username">Username</label>
                <input onChange={handleFormChange} placeholder="i.e. jdoe24" required type="text" name = "username" id="username" className="form-control" value={accountFormData.username}/>
              </div>
              <div className="form-floating mb-3">
                <label htmlFor="password">Password</label>
                <input onChange={handleFormChange} placeholder="i.e. Password24#" name = "password" id="password" className="form-control" value={accountFormData.password}/>
              </div>
              <div className="form-floating mb-3">
                <label htmlFor="first_name">First name</label>
                <input onChange={handleFormChange} placeholder="i.e. John" required type="text" name = "first_name" id="first_name" className="form-control" value={userFormData.first_name}/>
              </div>
              <div className="form-floating mb-3">
                <label htmlFor="last_name">Last name</label>
                <input onChange={handleFormChange} placeholder="i.e. Doe" required type="text" name = "last_name" id="last_name" className="form-control" value={userFormData.last_name}/>
              </div>
              <div className="form-floating mb-3">
                <label htmlFor="email">Email</label>
                <input onChange={handleFormChange} placeholder="i.e. jdoe24@gmail.com" required type="email" name = "email" id="email" className="form-control" value={userFormData.email}/>
              </div>
              <div className="mb-3">
                <select onChange={handleFormChange}required name = "icon_id" id="icon_id" className="form-select" value={userFormData.icon_id}>
                  <option value="">Choose a technician</option>
                  {technicians.map(technician => {
                      return (
                          <option key={technician.id} value={technician.id}>
                              {`${technician.first_name} ${technician.last_name}`}
                          </option>
                      )
                  })}
                </select>
              </div>
              <button className="btn btn-primary">Create</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    );
}

export default SignUpForm;
