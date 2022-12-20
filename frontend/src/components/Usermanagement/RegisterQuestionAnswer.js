import React, { useState, setState, useEffect } from 'react';
import UserPool from './UserPool';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import axios from 'axios';
import Header from '../Header';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import './style.css'
function RegisterQuestionAnswer() {


    const [Answer1, setAnswer1] = useState("");
    const navigate=useNavigate()
    const question="1) What is your favourite food?"
    const url = "https://us-central1-csci-5408-labtask.cloudfunctions.net/qNa"
    let [emailid,setEmailId]=useState(localStorage.getItem('email'))

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        if (id === "Answer1") {
            setAnswer1(value);
        }


    }

    const handleSubmit = async (event) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email: emailid, answer: Answer1})
        };
        await axios.post(url, requestOptions).then(res=>
            {
                console.log(res)
                navigate('/Cipher')

            })
    }

    return (
        <div>
            <Header />
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

export default RegisterQuestionAnswer