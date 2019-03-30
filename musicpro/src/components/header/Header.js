import React , {Component} from 'react'
import {connect} from 'react-redux'
import { NavLink } from 'react-router-dom'
import './Header.css'

class HeaderUI extends Component{
    render(){
        return (
            <div id='musicHeader'>
                {/* 当heaerArrow为true则显示这个标签 */}
                { this.props.headerArrow && <NavLink to='/list'><span>&lt;</span></NavLink>}
                    { this.props.musicName }
            </div>
        )
    }
}
function mapStateToProps(state){
    return {
        headerArrow:state.headerArrow,
        musicName:state.musicName
    }
}
function mapDispatchToProps(dispatch){
    return {

    }
}
var Header = connect(mapStateToProps,mapDispatchToProps)(HeaderUI)

export default Header