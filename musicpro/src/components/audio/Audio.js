import React , {Component} from 'react'
import {connect} from 'react-redux'
import './Audio.css'

class AudioUI extends Component{
    constructor(){
        super()
        this.handleTap = this.handleTap.bind(this)
    }
    render(){
        return (
            <div id="musicAudio">
                {/* 给小图标添加点击事件 */}
                <div ref='audioPlay' onTouchStart={this.handleTap} className="audioPlay"></div>
                <div ref="audioProgress" className="audioProgress">
                    <div ref="audioBar" className="audioBar"></div>
                    <div ref="audioNow" className="audioNow"></div>
                </div>
                {/* 在这里需要先判断一下id是否为空，不然会报错 */}
                <audio id="audio" ref="audio" src={ this.props.musicNameId && "/music/Music/Music?id="+ this.props.musicNameId +"&type=url"}></audio>
            </div>
        )
    }
    // 在点击歌曲播放和跳转歌词页时播放器一直存在，会触发一个钩子函数：componentDidUpdate
    componentDidUpdate(){
        if( this.props.isMusicPlay ){  //isMusicPlay为true时播放
            this.audioPlay()
        }else{
            this.audioPause()
        }
    }
    // 在挂载完成的钩子函数中调用拖拽方法
    componentDidMount(){
        this.handleDrag()
    }
    // 播放:通过ref数据来控制样式修改播放图标: 点击播放时图标变为暂停图标
    // 在audioPlay()中调用：并且使用定时器每隔1s
    audioPlay(){
        this.refs.audioPlay.style.backgroundImage = 'url(/images/list_audioPause.png)'
        this.refs.audio.play() // 让音频进行播放，audio自带方法
        this.playing()
        this.timer = setInterval(this.playing.bind(this) , 1000)
    }
    // 暂停：点击暂停时，图标变为播放图标
    audioPause(){
        this.refs.audioPlay.style.backgroundImage = 'url(/images/list_audioPlay.png)'
        this.refs.audio.pause() // 让音频暂停
        clearInterval(this.timer)
    }
    // 监听实时播放
    playing(){  
        var audioProgress = this.refs.audioProgress
        var audioBar = this.refs.audioBar
        var audioNow = this.refs.audioNow   
        var audio = this.refs.audio

        // 让小球和进度条往前走
        var scale = audio.currentTime / audio.duration
        audioBar.style.left = scale * audioProgress.offsetWidth + "px";
        audioNow.style.width = scale * 100 + "%";
    }
    // 小图标点击事件
    handleTap(){
        // 并没有歌曲被选中播放，进度条和播放器不能被拖拽和点击，所以需要做判断
        if( !this.refs.audio.getAttribute("src") ){
            return false;
        }else{
            // 判断播放还是暂停
            if(this.refs.audio.paused){ //暂停状态
                // 暂停状态点击之后就播放，这里需要调用状态管理方法
                this.props.isMusicPlayFn(true)
            }else{
                this.props.isMusicPlayFn(false)
            }
        }
        
    }
    // 进度条拖拽方法
    handleDrag(){
        var audioProgress = this.refs.audioProgress
        var audioBar = this.refs.audioBar
        var audioNow = this.refs.audioNow   
        var audio = this.refs.audio
        var disX = 0
        audioBar.ontouchstart = function(ev){
            //console.log(ev);
            var This = this;
            var touch = ev.changedTouches[0];
            disX = touch.pageX - this.offsetLeft;
            document.ontouchmove = function(ev){
                var touch = ev.changedTouches[0];
                var L = touch.pageX - disX;
                
                if(L < 0){
                    L = 0;
                }
                else if( L > audioProgress.offsetWidth ){
                    L = audioProgress.offsetWidth;
                }

                This.style.left = L + 'px';

                var scale = L / audioProgress.offsetWidth;  // 0~1
                // 当前播放时间 = 比例*总时长
                audio.currentTime = scale * audio.duration;
                // 进度条进度
                audioNow.style.width = scale * 100 + '%';

            } ;
            document.ontouchend = function(){
                document.ontouchmove = document.ontouchend = null;
            };
            return false; 
        }
    }
}
function mapStateToProps(state){
    return {
        isMusicPlay:state.isMusicPlay,
        musicNameId:state.musicNameId
    }
}
function mapDispatchToProps(dispatch){
    return {
        isMusicPlayFn(bool){
            dispatch({ type:"ISMUSICPLAY_CHANGE",payload:bool })
        }
    }
}
var Audio = connect(mapStateToProps,mapDispatchToProps)(AudioUI)

export default Audio