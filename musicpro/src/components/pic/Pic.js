import React , { Component } from 'react'
import './Pic.css'
import {connect} from 'react-redux'
class PicUI extends Component{
    constructor(){
        super()
        this.handleTouch = this.handleTouch.bind(this);
    }
    render(){
        return (
            <div id='musicPic'>
                <div ref="musicPic" onTouchStart={this.handleTouch}>
                    <img  src={'/music/Music/Music?id=' +this.props.match.params.id+'&type=pic'} alt='歌曲封面' />
                </div>
            </div>
        )
    }
    // componentDidUpdate在第一次触发时没有调用，所以还需要在componentDidMount上调用一次
    componentDidMount(){
        var id = this.props.match.params.id
        // 触发箭头的状态管理
        this.props.headerArrowFn()
        // 通过id触发歌曲播放
        this.props.musicNameIdFn(id)
        // componentDidUpdate在第一次触发时没有调用，所以还需要在componentDidMount上调用一次
        if(this.props.isMusicPlay){
            this.picPlay()
        }else{
            this.picPause()
        }
    }
    // 在componentDidUpdate中通过监听播放器的状态来调用picPlay和picPause
    componentDidUpdate(){
        if(this.props.isMusicPlay){
            this.picPlay()
        }else{
            this.picPause()
        }
    }
    picPlay(){
        var musicPic = this.refs.musicPic;
        musicPic.style.animationPlayState = 'running'
    }
    picPause(){
        var musicPic = this.refs.musicPic;
        musicPic.style.animationPlayState = 'paused'
    }
    // 封面点击事件：跳转到歌词页
    handleTouch(){
		var id = this.props.match.params.id;
		this.props.history.push('/lyric/' + id);
	}
}

function mapStateToProps(state){
    return {
        isMusicPlay:state.isMusicPlay
    }
}
function mapDispatchToProps(dispatch){
    return {
        headerArrowFn(){
            dispatch({ type:'HEADERARROW_CHANGE', payload:true })
        },
        musicNameIdFn(id){
            dispatch({ type:'MUSICNAMEID_CHANGE', payload:id })
        }
    }
}
var Pic = connect(mapStateToProps , mapDispatchToProps)(PicUI)
export default Pic