import React , {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import './Lyric.css'

class LyricUI extends Component{
    constructor(){
        super()
        this.state={
            lyricList:[],
            active:-1,
        }
        this.handleTouch = this.handleTouch.bind(this)
    }
    render(){
        return (
            <div id="musicLyric">
                <ul ref="musicLyricUl" onTouchStart={this.handleTouch}>
                    {
                        this.state.lyricList.map((item,index)=>{
                            return <li key={index} 
                                    className={ this.state.active === index ? "active" : ''}>
                                        {item.lyric}
                                    </li>
                        })
                    }
                </ul>
            </div>
        )
    }
    componentDidMount(){
        // console.log(this.props)
        var id = this.props.match.params.id
        // 通过id获取歌词
        axios.get('/music/Music/Music?id='+id+'&type=lrc').then(res=>{
            console.log(res.data)
            this.setState({
                // 格式化歌词事件：xx.ww
                lyricList:this.formatLyricData(res.data)
            })
        })
        //触发箭头的状态管理
		this.props.headerArrowFn();
		this.props.musicNameIdFn(id);
        if(this.props.isMusicPlay){
			this.lyricPlay();
		}
		else{
			this.lyricPause();   
		}
    }
    // 在这调用歌词播放：lyricPlay()
    // 需要通过播放器状态来进行播放：isMusicPlay,首先从状态管理中获取这个值    
   
    // 将判断播放器状态来执行播放或暂停放在componentWillReceiveProps钩子函数中执行
    // 这个钩子函数在传递进入当前组件的props发生变化时才调用
    componentWillReceiveProps(nextProps){
        // 需要通过播放器状态来进行播放：isMusicPlay,首先从状态管理中获取这个值
        if( nextProps.isMusicPlay ){
            this.lyricPlay()
        }else{
            this.lyricPause()
        }
    }
     // 返回列表页时，销毁定时器
    componentWillUnmount(){
        this.lyricPause()
    }
    lyricPlay(){
		this.playing();
		this.timer = setInterval( this.playing.bind(this) , 500 );
	}
	lyricPause(){
		clearInterval(this.timer);
	}
	playing(){
		var lyricList = this.state.lyricList;
		var audio = document.getElementById('audio');
		var musicLyricUl = this.refs.musicLyricUl;
		var musicLyricLi = musicLyricUl.getElementsByTagName('li')[0];

		for(var i=0;i<lyricList.length;i++){
            if( i+1<48 ){
                if( lyricList[i].time < audio.currentTime && lyricList[i+1].time > audio.currentTime ){
                    //console.log( lyricList[i].lyric );
                    this.setState({
                        active : i
                    });
                    if( i > 5 ){
                        if(lyricList[i].lyric){
                            musicLyricUl.style.top = - (i-5) * (musicLyricLi.offsetHeight + 8) + 'px';
                        }
                    }
                }
            }
            
		}
	}
     // 歌词点击事件：跳转到封面
    handleTouch(){
		var id = this.props.match.params.id;
		this.props.history.push('/pic/' + id);
	}
    // 格式化歌词
    formatLyricData(lyrics){
        var result = []
        // 正则：匹配[,排除多个]，
        var reg = /\[([^\]]+)\]([^[]+)/g;
        // 第二个参数是匹配到的时间，第三个参数是歌词内容
        lyrics.replace(reg , ($0,$1,$2)=>{
            result.push({ time: this.formatTimeToSec($1) , lyric:$2 })
        })
        return result
    }
    // 格式化时间
    formatTimeToSec(time){
        var arr = time.split(':')
        // 分*60+秒，并且保留两位小数
        return (parseFloat(arr[0]) * 60 + parseFloat(arr[1])).toFixed(2);
    }
   
}

function mapStateToProps(state){
    return {
        isMusicPlay: state.isMusicPlay
    }
}
function mapDispatchToProps(dispatch){
    return {
        headerArrowFn(){
            dispatch({ type:'HEADERARROW_CHANGE', payload: true})
        },
        musicNameIdFn(id){
            dispatch({ type:'MUSICNAMEID_CHANGE',payload:id})
        }
    }
}
var Lyric = connect(mapStateToProps,mapDispatchToProps)(LyricUI)

export default Lyric