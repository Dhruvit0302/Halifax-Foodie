import React, {useState} from 'react';
import { Dialog, DialogTitle, DialogContent, Card, Typography, DialogActions, Button, FormHelperText  } from '@mui/material';
import UserPool from './UserPool';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import Axios from 'axios';
// import './style.css'
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom'
function Cipher() {
    const navigate = useNavigate()
    const [keys, setKeys] = useState("");  
    const [keyError, setKeyError] = useState(""); 
    const [plainText,setplainText] = useState("");
    const [cipherText, setCipherText] = useState("");
    const [open, setOpen] = useState(false);
     const [email,setEmail]=useState(localStorage.getItem('email'))
    //const email="parvish@gmail.com"
    const url = "https://t3ea4p7m6xqde7nkqvcgcvbb5i0bmfgn.lambda-url.us-east-1.on.aws/"
    

    const handleInputChange = (e) => {
        const {id , value} = e.target;
        if(id === "keys"){
            setKeyError("");
            const regex = /^[^\s]{4}$/;
            if(!regex.test(value)) {
                setKeyError("Key should be of 4 characters only")
            }
            setKeys(value);
        }
        if(id === "plainText"){
            setplainText(value);
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
            body: JSON.stringify({ email:email, keys: keys, plainText: plainText })
        };
        console.log(requestOptions.body)
        fetch(url, requestOptions)
            .then((response) => response.json()).then((response) => {
                console.log(response)
                setCipherText(response);
                setOpen(true);
                console.log("open", open);
                console.log("ciphertext " , cipherText)
                // toast(response,{
                //     position: "top-right",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                //     theme: "light",
                //     })
                // navigate('/Login')
            })
       
    }

    function close() {
        setOpen(false);
        navigate('/Login')
    }

    function onHandleClose() {
        setOpen(true);
    }

    return(
        <div>
        <div className="form">
            <div className="form-body">
                <div className="keys">
                    <label className="form__label" for="keys"> Keys: </label>
                    <input className="form__input" type="text" value={keys} onChange = {event => handleInputChange(event)} id="keys" placeholder="Keys"/>
                    <FormHelperText style={{color:"red"}}>
                        {keyError}
                    </FormHelperText>
                </div>
                <div className="ciphertetx">
                    <label className="form__label" for="plainText"> Plain text: </label>
                    <input className="form__input" type="text" value={plainText} onChange = {event => handleInputChange(event)} id="plainText" placeholder="Plain text"/>
                </div>  
            </div>
            <div class="footer">
                <button onClick={handleSubmit} type="submit" class="btn">Register</button>
            </div>
            <Dialog open={open} onClose={onHandleClose}>
                <DialogTitle>Cipher text</DialogTitle>
                <DialogContent>
                    <Card elevation={0}>
                        <Typography>
                            {`Please note this text, it should be used while login : ${cipherText}`}
                        </Typography>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="success" style={{ border: "5px", marginBottom: "4%", backgroundColor: "#FFBB38" }} onClick={close}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
        <ToastContainer /></div>
       
    )       
}

export default Cipher