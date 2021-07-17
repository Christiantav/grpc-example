import React from 'react';
import * as timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'
import './App.css';

import { UserCreateRequest } from "./users/users_pb"
import { AddUserClient } from "./users/users_grpc_web_pb"

const { useState } = React;

const enableDevTools = window.__GRPCWEB_DEVTOOLS__ || (() => {});
const client = new AddUserClient('http://localhost:8000');
enableDevTools([
  client,
]);
function App() {
  const initialUserState = {
    email_address: '',
    first_name: '',
    last_name: '',
    phone_category: 0,
    phone: '',
    birthday: '',
    age: 0
  }
  const [userState, setUserState] = useState(initialUserState);
  const [errorState, setErrorState] = useState(false)

  const validateUser = () => {
    for (const property in userState) {
      if (!userState[property]) {
        console.log("invalid property: ", property);
        return false;
      };
    };
    return true;
  }

  const createUser = (e) => {
    e.preventDefault();

    console.log("called createUser");
    console.log("userState: ", userState);

    const isValid = validateUser();

    if (!isValid) {
      setErrorState(true);
      return;
    }

    const userCreateRequest = new UserCreateRequest()

    // const bday = new Date(userState.birthday)
    const bday = new timestamp_pb.Timestamp(new Date(userState.birthday))
    const today = new timestamp_pb.Timestamp(new Date())
    // const bday = new Date()
    // const today = new Date()

    // request.setName('World');
    userCreateRequest.setEmailAddress(userState.email_address);
    userCreateRequest.setFirstName(userState.first_name);
    userCreateRequest.setLastName(userState.last_name);
    userCreateRequest.setPhoneCategory(parseInt(userState.phone_category, 10));
    userCreateRequest.setPhone(userState.phone);
    userCreateRequest.setBirthday(bday);
    userCreateRequest.setAge(parseInt(userState.age, 10));
    userCreateRequest.setCreatedAt(today)

    return new Promise((resolve, reject) => {
      client.add(userCreateRequest, {}, (err, response) => {
        if (err) {
          console.log(`Unexpected error for addUser: code = ${err.code}` +
                      `, message = "${err.message}"`);
            reject(err.message)
        } else {
          console.log(`Pythonic response: ${response.getMessage()}`);
          resolve(response.getValue())
        }
      });
    })

    // return new Promise((resolve, reject) => {
    //   client.rpcCall(request, null, (err, response) => {
    //       if (err) {
    //           reject(err.message);
    //       }
    //       else {
    //           resolve();
    //       }
    //   });
    // });
  };

  const handleChange = (e) => {
    e.preventDefault();

    const name = e.target.name;
    const value = e.target.value;

    setUserState({
      ...userState,
      [name]: value,
    })
  }

  if (errorState) {
    return (
      <button onClick={() => {setErrorState(false)}}>
        You are missing a form field, please fill out the form to submit a request.
      </button>
    )
  }

  return (
    <div id="form-page">
      Add Users!
      <form onSubmit={createUser}>
        <input class="user-input" onChange={handleChange} placeholder="Email Address" value={userState.email_address} name="email_address" />
        <input class="user-input" onChange={handleChange} placeholder="First Name" value={userState.first_name} name="first_name" />
        <input class="user-input" onChange={handleChange} placeholder="Last Name" value={userState.last_name} name="last_name" />
        <input class="user-input" onChange={handleChange} placeholder="Phone Category (0 or 1)" value={userState.phone_category} name="phone_category" />
        <input class="user-input" onChange={handleChange} placeholder="Phone" value={userState.phone} name="phone" />
        <input class="user-input" type="date" onChange={handleChange} placeholder="Birthday" value={userState.birthday} name="birthday" />
        <input class="user-input" onChange={handleChange} placeholder="Age" value={userState.age} name="age" />
        <button id="submit-button" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;