import React , {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import './List.css'
import Loading from '../loading/Loading.js'
import { getSessionStorage, setSessionStorage } from '../../tools/index.js'

class ListUI extends Component{
    constructor(){
        super()
        this.state={
            musicList:[],
            isLoading:true
        }
        this.isMove = false // isMove为 trun时表示在列表滚动，默认为false
        this.handleMove = this.handleMove.bind(this)
    }
    render(){
        return (
            <div id="musicList" ref='musicList'>
                <ul>
                    {
                        this.state.isLoading === true ? <Loading /> : 
                            this.state.musicList.map((item,index)=>{
                                return (
                                    <li key={ item.id } onTouchMove={this.handleMove} 
                                    onTouchEnd={()=>{this.handleEnd(item.id , item.title)}}
                                    className={this.props.musicNameId === ''+item.id ? "active" : ''} >
                                        <div className="listOrder">{ index+1 }</div>
                                        <div className="listName">
                                            <h3>{ item.title }</h3>
                                            <p>{ item.author }</p>
                                        </div>
                                    </li>
                                )
                            })
                    }
                </ul>
            </div>
        )
    }
    componentDidMount(){
        // 获取本地存储
        var musicList = getSessionStorage('musicList')
        if( musicList ){
            this.setState({
                musicList:JSON.parse(musicList),
                isLoading:false
            },()=>{
                this.listScrollTop();
            })
        }else{
            axios.post('/api/index/index',{
                "TransCode":"020111",
                "OpenId":"Test",
                "Body":{"SongListId":"141998290"}
            }).then(res=>{
                // 判断返回状态值是否为OK
                if( res.data.ErrCode === 'OK'){
                    var musicList = res.data.Body.songs
                    this.setState({
                        musicList,
                        isLoading:false
                    },()=>{
                        // 滚动到对应歌曲的位置
                        this.listScrollTop()
                        // 进行本地存储，只能存储字符串
                        setSessionStorage('musicList',JSON.stringify(this.state.musicList))
                    })
                }
            })
        }
        // 触发箭头状态管理
        this.props.headerArrowFn()
    }
    handleMove(){
        this.isMove = true // 表示列表正在滚动
    }
    handleEnd(id , musicName){
        if(this.isMove){  // 滑动的时候
            this.isMove = false
        }else{ // 点击的时候
            // 编程式路由
            this.props.history.push('/pic/'+id)
            // 触发歌曲id和播放状态
            this.props.musicNameIdFn(id)
            this.props.isMusicPlayFn()
            this.props.musicNameFn(musicName)
        }
    }
    
    listScrollTop(){
        var musicList = this.refs.musicList
        var musicListLi = musicList.getElementsByTagName('li')
        for(var i=0;i<musicListLi.length;i++){
            if( musicListLi[i].className ){
                musicList.scrollTop = musicListLi[i].offsetTop
            }
        }
    }
}

function mapStateToProps(state){
    return {
        musicNameId: state.musicNameId
    }
}
function mapDispatchToProps(dispatch){
    return {
        headerArrowFn(){
            dispatch({ type:'HEADERARROW_CHANGE', payload:false })
        },
        musicNameIdFn(id){
            dispatch({ type:'MUSICNAMEID_CHANGE',payload:id })
        },
        isMusicPlayFn(){
            dispatch({ type:'ISMUSICPLAY_CHANGE',payload:true })
        },
        musicNameFn(musicName){
            dispatch({ type:'MUSICNAME_CHANGE',payload:musicName })
        }
    }
}
var List = connect(mapStateToProps,mapDispatchToProps)(ListUI)

export default List