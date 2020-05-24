import React, {Component} from "react"
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import {Link} from "react-router-dom"
import axios from "axios"
import {paginate} from "./utils"

import _ from "lodash"

export default class HomeComponent extends Component{
    constructor(){
        super()
    }

    range = (start, end) => {
        let rng = []

        for(var i=start;i<=end;i++) {
            rng.push(i)
        }

        return rng
    }



    loadMarketData = () => {
        const baseurl = "http://localhost:3200"

        axios.get(baseurl+"/allMarket", {
            headers:{
                "Content-Type":"application/json"
            }
        }).then((result)=>{
            //console.log(result.data)
            this.setState({
                markets:result.data.response
            })

        })

        this.LoadCategories();
    }
    componentDidMount() {


        this.loadMarketData()

        let PagedItems = paginate(this.state.markets, this.state.currentPage, 5).value()

        this.setState({PagedItems:PagedItems})
        //this.setState()
        console.log(this.state.PagedItems)
    }

    state={
        markets:[],
        message:"",
        currentPage:1,
        searchName:"",
        searchCategory:"All",
        curentFilter:"All",
        FoodCategories:["All"],
        PagedItems:[]


    }
    LoadCategories = () => {
        const baseurl = "http://localhost:3200"
        const {FoodCategories} =this.state
        axios.get(baseurl+"/allCategories", {
            headers:{
                "Content-Type":"application/json"
            }
        }).then((result)=>{
            //console.log(result.data)
            result.data.response.forEach(v=>{
                FoodCategories.push(v)
            })

            this.setState({
                FoodCategories
            })



        })
    }

    NextPage = () => {
        this.setState({
            currentPage:this.state.currentPage++
        })
    }

    handleSearch = (name, category) => {
        //console.log()
        let {searchName, searchCategory, PagedItems}= this.state
        console.log(searchName, searchCategory)
        if(category == "" || category == "All") {
            searchCategory = "All"
        }

        searchName = name

        PagedItems.filter(v=>v.name == searchName && v.category == searchCategory)
        this.setState({
            searchName:searchName,
            searchCategory:searchCategory,
            PagedItems:PagedItems
        })



       console.log(this.state.searchName, this.state.searchCategory)
    }

    PreviousPage = () => {
        this.setState({
            currentPage:this.state.currentPage--
        })
    }

    handleFilterChange = (e) => {
        const formName = e.currentTarget.name

        if(formName == "category") {
            this.setState({searchCategory:e.currentTarget.value})
        }
        else if(formName == "name") {
            const name = e.currentTarget.value
            this.setState({searchName:name})
        }

    }
    handleFilter = (v)=>{
       // console.log(v)
        this.setState({curentFilter:v})
        console.log(this.state.curentFilter)
    }

    handlePageClick = (pageNumber) => {
        this.setState({
            currentPage:pageNumber
        })
    }







    render() {
        const {markets, FoodCategories, currentPage, curentFilter, searchCategory, searchName, PagedItems} = this.state
        const PerPage = Math.ceil(markets.length / 5);
        const ranges = _.range(1, PerPage + 1)
        const pagedItem = paginate(markets, currentPage, 5, searchName, searchCategory).value();
        console.log(searchCategory)
        let searchItem = pagedItem
        if(curentFilter != "All") {
            searchItem = searchItem.filter(v=>v.category == curentFilter)
        }


       // console.log(pagedItem)

        return(
            <div className="container">
                <div className="row">
                    <div className="col-lg-3">

                    </div>

                    <div className="col-lg-9">
                        <form>
                            <table className="table">
                                <tbody>
                                <tr>
                                    <td>
                                        <input onChange={this.handleFilterChange} type="text" name="name" placeholder="filter by market name" className="form-control" />
                                    </td>
                                    <td>
                                        <select name="category" className="form-control" onChange={this.handleFilterChange}>
                                            <option defaultValue value="">Select category</option>
                                            {
                                                FoodCategories.map(v=>
                                                    <option value={v} key={v}>{v}</option>
                                                )
                                            }
                                        </select>
                                    </td>
                                    <td>
                                        <button type="button" onClick={this.handleSearch} className="btn btn-primary">Go</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>




                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-3">
                        <ul className="list-group">
                            {
                                FoodCategories.map(v =>
                                    <li className={ curentFilter ==  v ? "list-group-item active": "list-group-item"} key={v}>
                                        <a onClick={()=>this.handleFilter(v)} href="#" style={{color: curentFilter == v ? "white":"Blue"}}>
                                            {v}
                                        </a>
                                    </li>

                                )
                            }
                        </ul>
                    </div>
                    <div className="col-lg-9">
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
                                searchItem.map(v =>
                                    <tr key={v.name}>
                                        <td>{v.name}</td>
                                        <td>{v.location}</td>
                                        <td>{v.category}</td>
                                        <td>{v.price}</td>
                                        <td>{v.description}</td>
                                        <td><img src={v.images[0]} width={70} height={70} alt={v.name} /> </td>

                                    </tr>
                                )
                            }
                            </tbody>
                        </table>

                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-3"></div>
                    <div className="col-lg-9">
                        <ul className="pagination">
                            <li className="page-item"><a onClick={this.PreviousPage} className="page-link" href="#">Previous</a></li>
                            {
                                ranges.map(v=>
                                    <li className={currentPage == v ? "page-item active": "page-item"} key={v}>
                                        <a onClick={()=>this.handlePageClick(v)} className="page-link" href="#">{v}</a></li>
                                )
                            }

                            <li className="page-item"><a onClick={this.NextPage} className="page-link" href="#">Next</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}