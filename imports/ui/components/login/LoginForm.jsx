import {Meteor} from 'meteor/meteor';
import React, {useState} from "react";
import {LoginWithGithub} from "./LoginWithGithub";

export const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submit = e =>{
        e.preventDefault();

        Meteor.loginWithPassword(username, password, function (err){
            if(err){
                alert("아이디 또는 비밀번호가 일치하지 않습니다.");
            }else{
                console.log("로그인성공");
            }
        });
    };

    return(
        <form onSubmit={submit} className="login-form">
            <LoginWithGithub/>
            <div>
                <label htmlFor="username">UserName</label>

                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    required
                    onChange={e => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password">Password</label>

                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    required
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <div>
                <button type="submit">Log In</button>
            </div>
        </form>
    )
}