import {useEffect} from "react";
import "./loginModal.scss"

export default function LoginModal({}){
    useEffect(() => {

    });

    return(
        < div className="login-background">
            <div className="login-modal">
                <div className="login-modal-header">
                    <div className="login-modal-title">Введите ваше имя</div>
                    <div className="modal-close">+</div>
                </div>
                <form className="login-form">
                    <input type="text" name="username" placeholder="имя" className="inputName"/>
                    <button type="submit" className="loginButton">Войти</button>
                </form>
            </div>
        </div>
    )

}
