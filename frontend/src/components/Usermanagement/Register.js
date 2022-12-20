import React, { useState, setState } from 'react';
import UserPool from './UserPool';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import Axios from 'axios';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
// import './style.css'
function RegistrationForm() {

    const [firstName, setFirstName] = useState("");
    const [roles, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const url = "https://axh4wpzwcmp3idzczvyuivz4q40xwakk.lambda-url.us-east-1.on.aws/"

    const navigate=useNavigate()

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "firstName") {
            setFirstName(value);
        }
        if (id === "roles") {
            setRole(value);
        }
        if (id === "email") {
            setEmail(value);
        }
        if (id === "password") {
            setPassword(value);
        }


    }

    const handleSubmit = async (event) => {
        // event.preventDefault();  

        console.log(firstName, roles, email, password);
        UserPool.signUp(email, password, [], null, (err, data) => {
            if (err) {
                console.error(err);
            }
            console.log(data);
        })

        // const response = await fetch(url,{
        //     firstName: firstName,
        //     roles: roles
        // })      

        // console.log(response);
        // https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples
        // https://stackoverflow.com/questions/25727306/request-header-field-access-control-allow-headers-is-not-allowed-by-access-contr
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: JSON.stringify({ email: email, firstName: firstName, roles: roles })
        };
        fetch(url, requestOptions)
            .then(response => response.json()).then(res=>{
                console.log(res)
                localStorage.setItem('email',email)
                navigate('/RegisterQuestionAnswer')
            })

    }
    return (
        <div>
            <Header />
            <div className="form">
                <div className="form-body">
                    <div className="username">
                        <label className="form__label" for="firstName">First Name: </label>
                        <input className="form__input" type="text" value={firstName} onChange={event => handleInputChange(event)} id="firstName" placeholder="First Name" />
                    </div>
                    <div className='Role' >
                        <label>Role:</label>
                        <input type="radio" name="roles" value="Customer" onChange={event => setRole(event.target.value)} />Customer
                        <input type="radio" name="roles" value="Restaurant" onChange={event => setRole(event.target.value)} />Restaurant
                    </div>
                    <div className="email">
                        <label className="form__label" for="email">Email: </label>
                        <input type="email" id="email" className="form__input" value={email} onChange={event => handleInputChange(event)} placeholder="Email" />
                    </div>
                    <div className="password">
                        <label className="form__label" for="password">Password: </label>
                        <input className="form__input" type="password" id="password" value={password} onChange={event => handleInputChange(event)} placeholder="Password" />
                    </div>

                </div>
                <div class="footer">
                    <button onClick={() => handleSubmit()} type="submit" class="btn">Register</button>
                </div>
            </div>
        </div>
    )
}

export default RegistrationForm