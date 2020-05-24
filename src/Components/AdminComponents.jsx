import React, {Component} from "react"
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import {Link} from "react-router-dom"
import axios from "axios"


export default class AdminComponent extends Component{
    constructor(){
        super()
    }

    IsUserAuthenticated = () => {
        const uid = localStorage.getItem("uid");
        console.log(uid)
        if(uid == null) {
            console.log("Should Redirect")
            window.location.href="/login"
        }
    }

    checkForExpiredToken = async () =>{
        const uid = localStorage.getItem("uid");
        const url = "http://localhost:3200/validate"

    }

    checkForInactivity = () => {
        let timeOutSeconds = 10
        let inActivityCount = 0
        let inProgress = false
        document.onmousemove = () => {
            //console.log("mousemouve")
            inProgress = true
            inActivityCount = 0
        }

        document.onclick = () => {
            //console.log("clicked")
            inProgress = true
            inActivityCount = 0
        }

        document.onkeypress = () => {
            //console.log("keypress")
            inProgress = true
            inActivityCount = 0
        }

        window.setInterval(()=>{
            inActivityCount++

            if(inActivityCount > timeOutSeconds) {
                localStorage.clear()
                localStorage.setItem("msg", "Session Timeout due to inactivity")
                window.location.href ="/login"
            }
        }, 1000)
    }

    componentDidUpdate() {
       // this.checkForInactivity()
        this.IsUserAuthenticated()
    }

    loadMarketData = () => {
        const baseurl = "http://localhost:3200"

        axios.get(baseurl+"/allMarket", {
            headers:{
                "Content-Type":"application/json"
            }
        }).then((result)=>{
            console.log(result.data)
            this.setState({
                markets:result.data.response
            })

        })

        this.LoadCategories();
    }
    componentDidMount() {
        this.IsUserAuthenticated();

        this.loadMarketData()
        //this.setState()
    }

    state={
        markets:[],
        message:"",
        errorCount:[],
        isNewMarketButtonClicked:false,
        FoodCategories:[],
        isFormValid:false,
        formError:{
            image:{
              error:"",
              value:[]
            },
            name:{
                value:"",
                error:"",
                renderBorder:false
            },
            category:{
                value:"",
                error:"",renderBorder:false
            },
            description:{
                value:"",
                error:"",renderBorder:false
            },
            price:{
                value:"",
                error:"",renderBorder:false
            },
            location:{
                value:"",
                error:"",renderBorder:false
            }
        }
    }

    handleDelete(name) {
        const uril = "http://localhost:3200/delete/"+name
        axios.get(uril).then(r=> {
            if(r.data.statusCode == "00") {
                alert(`${name} deleted`)
            }
            else {
                alert(r.data.message)
            }
        }).catch(er=> {
            alert(er.toString())
        })
        this.loadMarketData()
       // window.location.reload(true)
    }

    addNewMarket= ()=>{
        this.setState({isNewMarketButtonClicked:true})
    }

    gotoDashboard = () => {
        this.setState({isNewMarketButtonClicked:false})
    }

    LoadCategories = () => {
        const baseurl = "http://localhost:3200"

        axios.get(baseurl+"/allCategories", {
            headers:{
                "Content-Type":"application/json"
            }
        }).then((result)=>{
            //console.log(result.data)
            this.setState({
                FoodCategories:result.data.response
            })

        })
    }

    handleFormInput = (e) => {
        const target =e.currentTarget;
        const currentName = target.name;
        const currentValue = target.value
        //console.log(target)
        this.validateFormInputs(currentValue, currentName)

        const {errorCount} =this.state

        if(errorCount.length < 1) {
            this.setState({
                isFormValid:true
            })
        }

      //  console.log(this.state.errorCount)

    }

    handleSelectImage = (e) =>{
        const file = e.target.files
        const firstFile = file[0]
        const type =  firstFile.type
        const size = firstFile.size

        const {formError}= this.state

        if(!(size > 72000)) {

            if(type == "image/jpeg" || type == "image/jpg" || type == "image/png" || type == "image/tiff") {
                var fl = new FileReader()
                fl.readAsDataURL(firstFile)

                fl.onload = function(re) {
                    console.log(re.originalTarget.result)
                    formError["image"]["value"] = re.originalTarget.result
                }

                this.setState({
                    formError:formError
                })

                console.log(this.state.formError)
            }
            else {
                formError["image"]["error"] = "only file format (jpeg, jpg, png, tiff) allowed"
            }

        }
        else {
            formError["image"]["error"] = "image can not greater than 70kb"
        }


    }


    handleCreateMarket = (name,category, location, description, price, image) => {
        const baseurl = "http://localhost:3200"


        this.setState({
            isFormValid:false
        })
        axios.post(baseurl + "/CreateMarket", JSON.stringify({
            name:name,
            category:category,
            price:price,
            description:description,
            location:location,
            images:[image]
        }), {
            headers:{
                "Content-Type":"application/json"
        }
        }).then((response)=>{

                this.setState({
                    message:response.data.message
                })


        }).catch(er=>{
            console.log(er)

            this.setState({
                message:er
            })
        })

    }

    validateFormInputs(input, formName) {
        let isValid = false;
        let formInput = false;
        let formError = {...this.state.formError}
        let isTempFormValid = false;

        if(formName == "name") {
             formInput = typeof(input) == "string" && input.trim().length > 0 ? input : false;
             if(!formInput) {
                 isValid = false
                 formError["name"]["error"] = `a value is required for ${formName}`

                 formError[formName]["renderBorder"] = "2px solid red"
                 this.setState({
                     formError:formError

                 })
             }
             else {


                 formError["name"]["error"] = ``
                 formError["name"]["value"] = formInput
                 this.setState({
                     formError:formError

                 })
             }
        }
        else if(formName == "category") {
            formInput = typeof(input) == "string" && input.trim().length > 0 && input.trim() != "" ? input : false;
            if(!formInput) {
                isValid = false
                formError["category"]["error"] = `a value is required for ${formName}`
                formError["category"]["renderBorder"] = "2px solid red"
                let {errorCount} = this.state
                errorCount.push("category")
                this.setState({
                    formError:formError

                })
            }
            else {
                //let index  = this.state.errorCount.indexOf("category")
                isValid = true
                formError["category"]["error"] = ``
                formError["category"]["value"] = formInput
                this.setState({
                    formError:formError

                })
            }
        }
        else if(formName == "location") {
            formInput = typeof(input) == "string" && input.trim().length > 0 ? input : false;
            if(!formInput) {
                isValid = false
                formError["location"]["error"] = `a value is required for ${formName}`
                formError["location"]["renderBorder"] = "2px solid red"
                let {errorCount} = this.state
                //errorCount.push("location")
                this.setState({
                    formError:formError
                })
            }
            else {
                //let indexof = this.state.errorCount.indexOf("location")
                isValid = true
                formError["location"]["error"] = ``
                formError["location"]["value"] = formInput
                this.setState({
                    formError:formError

                })
            }
        }
        else if(formName == "description") {
            formInput = typeof(input) == "string" && input.trim().length > 0 ? input : false;
            if(!formInput) {
                isValid = false
                formError["description"]["error"] = `a value is required for ${formName}`
                formError["description"]["renderBorder"] = "2px solid red"
                //let {errorCount} = this.state
                //errorCount.push("description")
                this.setState({
                    formError:formError

                })
            }
            else {
                //let indexof = this.state.errorCount.indexOf("description")
                isValid = true
                formError["description"]["error"] = ``
                formError["description"]["value"] = formInput
                this.setState({
                    formError:formError

                })
            }
        }
        else if(formName == "price") {
            formInput = parseFloat(input) != null && parseFloat(input) > 0.0 ? parseFloat(input):false;
            if(!formInput) {
                formError.price.error = `please input a valid number for price`
                formError["price"]["renderBorder"] = "2px solid red"
                this.setState({
                    formError:formError
                })
            }
            else {
                //let indexof = this.state.errorCount.indexOf("price")
                isValid = true
                formError["price"]["error"] = ``
                formError["price"]["value"] = formInput
                this.setState({
                    formError:formError

                })
            }

        }

        if(formError["name.value"] != "" && formError["category.value"] != ""
            && formError["description.value"] != "" && formError["location.value"] != "" && formError["price.value"] != "") {
            this.setState({
                isFormValid:true
            })
        }
        //let formErrors = Object.keys(formError)
        return isValid
    }

    render() {
        const {markets, isNewMarketButtonClicked, FoodCategories, isFormValid, formError, message} = this.state
        const {name, location, description, category, price, image} = this.state.formError
        return(
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <h1>Admin Page</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-3">
                        <ul className="list-group">
                            <li className="list-group-item">
                                <a href="#" onClick={this.gotoDashboard}>
                                    Dashboard
                                </a>
                            </li>
                            <li className="list-group-item">
                                <a href="#" onClick={this.addNewMarket}>
                                    Add New Market
                                </a>
                            </li>

                            <li className="list-group-item">
                                <a href="#" onClick={this.addNewMarket}>
                                    Create New Admin
                                </a>
                            </li>
                            <li className="list-group-item">
                                <a href="#" onClick={()=>{
                                    localStorage.clear()
                                    window.location.href="/login"
                                }}>
                                    Logout
                                </a>
                            </li>

                        </ul>
                    </div>
                    <div className="col-lg-9">
                        {isNewMarketButtonClicked &&

                            <form className="form-horizontal">
                                <h1 style={{fontSize:"30px", color:"green"}}>{message}</h1>
                                <h1>Add New Market</h1>
                                <table className="table">
                                    <tbody>
                                    <tr>
                                        <td>Market Name</td>
                                        <td><input style={{border: formError["name.renderBorder"] != false ? formError["name.renderBorder"]: "0px"}} onBlur={this.handleFormInput} onChange={this.handleFormInput} type="text" name="name" className="form-control" /> </td>
                                        <td><span style={{color:"red"}}>{formError.name.error}</span> </td>
                                    </tr>
                                    <tr>
                                        <td>Select Category</td>
                                        <td>
                                            <select style={{border: formError["category.renderBorder"] != false ? formError["category.renderBorder"]: "0px"}} onBlur={this.handleFormInput} onChange={this.handleFormInput} name="category" className="form-control">
                                                <option selected value="">Select Category</option>
                                                {
                                                    FoodCategories.map(v=>
                                                        <option value={v} key={v}>{v}</option>
                                                    )
                                                }


                                            </select>
                                        </td>
                                        <td>
                                            <span style={{color:"red"}}>{formError.category.error}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Description</td>
                                        <td><input style={{border: formError["description.renderBorder"] != false ? formError["description.renderBorder"]: "0px"}} onBlur={this.handleFormInput} onChange={this.handleFormInput} type="text" name="description" className="form-control" /> </td>
                                        <td><span style={{color:"red"}}>{formError.description.error}</span> </td>
                                    </tr>
                                    <tr>
                                        <td>Location</td>
                                        <td><input style={{border: formError["location.renderBorder"] != false ? formError["location.renderBorder"]: "0px"}} onBlur={this.handleFormInput} onChange={this.handleFormInput} type="text" name="location" className="form-control" /> </td>
                                        <td><span style={{color:"red"}}>{formError.location.error}</span> </td>
                                    </tr>
                                    <tr>
                                        <td>Price</td>
                                        <td><input style={{border: formError["price.renderBorder"] != false ? formError["price.renderBorder"]: "0px"}} onBlur={this.handleFormInput} onChange={this.handleFormInput} type="text" name="price" className="form-control" /> </td>
                                        <td><span style={{color:"red"}}>{formError.price.error}</span> </td>
                                    </tr>
                                    <tr>
                                        <td>Select Image</td><td><input  required onChange={this.handleSelectImage} type="file" name="pp" className="form-control" /> </td>
                                        <td><span style={{color:"red"}}> {formError.image.error}</span></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <span style={{display:isFormValid == false ? "block":"none"}}>A button will appear when the form fields are all filled up</span>
                                            <button className="btn btn-success"
                                                    onClick={()=>this.handleCreateMarket(name.value, category.value, location.value, description.value, price.value, image.value)}
                                                    type="button" style={{display:isFormValid == true ? "block":"none"}}>Create Market</button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </form>
                        }

                        {!isNewMarketButtonClicked &&
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Category</th>
                                <th>Prince</th>
                                <th>Description</th>
                                <th>Image</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                markets.map(v =>
                                    <tr key={v.name}>
                                        <td>{v.name}</td>
                                        <td>{v.location}</td>
                                        <td>{v.category}</td>
                                        <td>{v.price}</td>
                                        <td>{v.description}</td>
                                        <td><img src={v.images[0]} width={70} height={70} alt={v.name} /> </td>
                                        <td>
                                            <a href="#" onClick={() => this.handleDelete(v.timestamp)}
                                               className="btn btn-danger">
                                                Delete
                                            </a>
                                        </td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                        }
                    </div>
                </div>
            </div>
        )
    }
}