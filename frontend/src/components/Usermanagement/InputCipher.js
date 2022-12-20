import React, {useState} from 'react';
import UserPool from './UserPool';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Header from '../Header';
import {useNavigate} from 'react-router-dom'
// import './style.css'
function InputCipher() {
    const [keys, setKeys] = useState("");   
    const [ciphertexts,setciphertext] = useState("");
     const [email,setEmail]=useState(localStorage.getItem('email'))
    //const email="parvish@gmail.com"
    const url = "https://gj5poufubgnietdbo25zgqimgm0dctpj.lambda-url.us-east-1.on.aws/"
    var navigate=useNavigate()

    const handleInputChange = (e) => {
        const {id , value} = e.target;
        if(id === "keys"){
            setKeys(value);
        }
        if(id === "ciphertexts"){
            setciphertext(value);
        }
    

    }

    const handleSubmit  = async (event) => {
        // event.preventDefault();  
        // const response = await fetch(url,{
        //     firstName: firstName,
        //     roles: roles
        // })      
        console.log("nnnnnnnnnnnnnnnnnnnnnn")
        // console.log(response);
        // https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples
        // https://stackoverflow.com/questions/25727306/request-header-field-access-control-allow-headers-is-not-allowed-by-access-contr
        const requestOptions = {
            method: 'POST',
           // headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: JSON.stringify({ email:email, keys: keys, ciphertext: ciphertexts })
        };
        fetch(url, requestOptions)
        .then((response) => response.json()).then((response) => {
            console.log(response)
            navigate('/Login')
        })
       
    }
    return(
        <div>
            <Header />
        <div className="form">
            <div className="form-body">
                <div className="keys">
                    <label className="form__label" for="keys"> Keys: </label>
                    <input className="form__input" type="text" value={keys} onChange = {event => handleInputChange(event)} id="keys" placeholder="Keys"/>
                </div>
                <div className="ciphertetx">
                    <label className="form__label" for="ciphertexts"> Cipher text: </label>
                    <input className="form__input" type="text" value={ciphertexts} onChange = {event => handleInputChange(event)} id="ciphertexts" placeholder="Cipher  text"/>
                </div>
                                
            
            </div>
            <div class="footer">
                <button onClick={handleSubmit} type="submit" class="btn">Submit</button>
            </div>
        </div>
         </div>
       
       
    )       
}

export default InputCipher