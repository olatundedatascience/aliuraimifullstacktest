import React, {Component} from "react"
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import axios from "axios"
//import fetch from "node-fe"


export default class LoginComponent extends Component {
    state= {
        message:"",
        hasLoginError:false,
        canLogin:false,
        pflag:"Show",
        pFlagKey:true,
        formValues:{
            email:{
                value:"",
                error:""
            },
            password:{
                value:"",
                error:""
            }
        }
    }


    componentDidMount() {
        const msg = localStorage.getItem("msg")
        console.log(msg)
       localStorage.clear()
        this.setState({
            hasLoginError:true,
            message:msg
        })
    }
    handleFormInput = (e)=>{
       // console.log(e.currentTarget)
        const formName = e.currentTarget.name
        const formValue = e.currentTarget.value
        const {formValues} = this.state
        //console.log(formValue)
        if(formName == "email") {
            //console.log(formValue)
            if(formValue == "" || formValue.trim().length < 1) {

                formValues["email"]["error"] = "email is required"

                this.setState({
                    formValues:formValues
                })
            }
            else {
                formValues["email"]["error"] = ""
                formValues["email"]["value"] = formValue

                this.setState({
                    formValues:formValues
                })
            }
        }

        if(formName ==  "password") {
            if(formValue == "") {
                formValues["password"]["error"] = "password is required"
                this.setState({
                    formValues:formValues
                })
            }
            else {
                formValues["password"]["error"] = ""
                formValues["password"]["value"] = formValue
                this.setState({
                    formValues:formValues
                })
            }
        }

        if(formValues["email"]["value"] != "" && formValues["password"]["value"] != null) {
            this.setState({
                canLogin:true
            })
        }
    }


    handleLogin = async (email, password) => {
        const baseurl  ="http://localhost:3200"

        this.setState({
            canLogin:false

        })
        const data = JSON.stringify({"email":email, "password":password});
        const result = await axios.post(baseurl+"/auth", data, {headers:{"Content-Type":"application/json"}})
        //console.log(result)
        const response = result.data

        if(response.statusCode == "00") {
            const token = response.response

            localStorage.setItem("uid",token);

            const getItem = localStorage.getItem("uid");

            if((getItem != null || getItem != undefined) && (""+getItem).length > 0 ) {
                window.location.href = "/admin"
            }
        }
        else {
            this.setState({
                hasLoginError:true,
                message:"invalid username /password combination"
            })
        }




        this.setState({
            canLogin:true

        })
    }
    handlePFlag = () => {
        let pFlagKey = this.state.pFlagKey

        pFlagKey = !pFlagKey

        this.setState({
            pFlagKey:pFlagKey
        })

        if(pFlagKey) {
            this.setState({
                pflag:"Show"
            })
        }
        else {
            this.setState({
                pflag:"Hide"
            })
        }

    }
    render() {
        const {hasLoginError, message, canLogin, pflag, pFlagKey} = this.state
        const {email, password} = this.state.formValues
        return(
            <div className="container">
                <div className="row">
                    <div className="col-lg-3"></div>
                    <div className="col-lg-39">
                    {
                        hasLoginError && <h1 style={{fontSize:"30px", color:"red"}}>{message}</h1>
                    }

                        <h1>Authenticate User </h1>
                    <form method="POST">

                        <table className="table">
                            <tbody>
                            <tr>
                                <td>
                                    Email Address
                                </td>
                                <td>
                                    <input onBlur={this.handleFormInput} onChange={this.handleFormInput} type="text" name="email" className="form-control" />
                                </td>
                                <td><span style={{color:"red"}}>{this.state.formValues.email.error}</span> </td>
                            </tr>
                            <tr>
                                <td>
                                    Password
                                </td>
                                <td>
                                    <input onBlur={this.handleFormInput} onChange={this.handleFormInput} type={pFlagKey == true ? "password":"text"} name="password" className="form-control" />
                                </td>
                                <td><span style={{color:"red"}}>{this.state.formValues.password.error}</span> </td>
                                <td>
                                    <a href="#" onClick={this.handlePFlag}> {pflag}</a>
                                </td>
                            </tr>
                            <tr>

                                <td>
                                    <input onClick={()=>this.handleLogin(email.value, password.value)}  type="button" value="Login" disabled={canLogin == true ? false :true} className="btn btn-primary" />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                </div>
            </div>
        )
    }
}