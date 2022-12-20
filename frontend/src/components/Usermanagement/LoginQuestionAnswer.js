import React, { useState, setState, useEffect } from 'react';
import UserPool from './UserPool';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import Axios from 'axios';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
// import './style.css'
import Header from '../Header';
function LoginQuestionAnswer() {


    const [Answer1, setAnswer1] = useState("");
    const question = "1) What is your favourite food?"
    const url = "https://us-central1-csci-5408-labtask.cloudfunctions.net/qNaLogin"
    // const emailid = localStorage.getItem('email')
    const navigate=useNavigate()
    const [emailid,setEmailId]=useState(localStorage.getItem('email'))

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        if (id === "Answer1") {
            setAnswer1(value);
        }


    }

    const handleSubmit = async (event) => {''
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailid, answer: Answer1 })
        };
        console.log(requestOptions.body)
        await axios.post(url, requestOptions).then(res => {
            console.log(res.data)
            if (res.data.status) {
                toast(res.data.message, {
                    position: "top-right",
                    autoClose: 300,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                });
                navigate('/InputCipher')
            } else {
                toast(res.data.message.toString(), {
                    position: "top-right",
                    autoClose: 300,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                });
            }
        })
    }

    return (
        <div className='container'>
            <Header />
            <ToastContainer />
            <div className="form">
                <div className="form-body">
                    <label>{question}</label>
                    <div className="answer">
                        <label className="form__label" for="Answer1">Answer 1: </label>
                        <input className="form__input" type="text" value={Answer1} onChange={event => handleInputChange(event)} id="Answer1" placeholder="Answer 1" />
                    </div>
                </div>
                <div class="footer">
                    <button onClick={() => handleSubmit()} type="submit" class="btn">Submit</button>
                </div>
            </div>
        </div>
    )
}

export default LoginQuestionAnswer