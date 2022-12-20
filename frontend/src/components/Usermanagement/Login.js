import React, { useState, setState, useEffect } from 'react';
import UserPool from './UserPool';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Axios from 'axios';
import axios from 'axios';
import Header from '../Header';
import navigate from 'navigate';
import { useNavigate } from 'react-router-dom';
// import './style.css'

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [posts, setPosts] = useState([]);
    var navigate=useNavigate()
    const url = "https://nzloxirut7vabfucok5r75vvsq0wfxtz.lambda-url.us-east-1.on.aws/"
    // useEffect(() => {
    //     axios
    //         .get("https://nzloxirut7vabfucok5r75vvsq0wfxtz.lambda-url.us-east-1.on.aws/")
    //         .then((response) => {
    //             setPosts(response.data);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }, []);


    const handleInputChange = (e) => {
        const { id, value } = e.target;

        if (id === "email") {
            setEmail(value);
        }
        if (id === "password") {
            setPassword(value);
        }



    }
    const handleSubmit = async (event) => {
        // event.preventDefault();  
        const user = new CognitoUser({
            Username: email,
            Pool: UserPool,
        });

        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
        });
        user.authenticateUser(authDetails, {
            onSuccess: (data) => {
                console.log("onSucess: ", data);
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    body: JSON.stringify({ email: email })
                };
                fetch(url, requestOptions)
                    .then(response => response.json()).then(res => {
                        console.log(res)
                        localStorage.setItem('role',res.Item.roles)
                        localStorage.setItem('email', email)
                        console.log("navigating..")
                        navigate('/LoginQuestionAnswer')
                    })
            },
            onFailure: (err) => {
                console.error("onFailure:", err);
            },
            newPasswordRequired: (data) => {
                console.log("new Password Required: ", data);
            }

        })

        // console.log(email,password);
        // UserPool.signUp(email,password,[],null,(err,data)=>{
        //     if(err){
        //         console.error(err);
        //     }
        //     console.log(data);
        // }) 

        // const response = await fetch(url,{
        //     firstName: firstName,
        //     roles: roles
        // })      

        // console.log(response);
        // https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples
        // https://stackoverflow.com/questions/25727306/request-header-field-access-control-allow-headers-is-not-allowed-by-access-contr
        // const requestOptions = {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        //     body: JSON.stringify({ email:email, firstName: firstName, roles: roles })
        // };
        // fetch(url, requestOptions)
        //     .then(response => response.json())

    }
    return (
        <div>
            <Header />
            <div className="form">
                <div className="form-body">

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
                    <button onClick={() => handleSubmit()} type="submit" class="btn">Proceed further</button>
                </div>
            </div>
        </div>
    )
}

export default Login