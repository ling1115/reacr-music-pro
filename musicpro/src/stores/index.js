import { createStore,combineReducers} from 'redux'

// 箭头状态管理
function headerArrowReducer(state=false,action){
    if(action.type === 'HEADERARROW_CHANGE'){
        return action.payload
    }else{
        return state
    }
}
// 歌曲id状态管理
function musicNameIdReducer(state='',action){
    if(action.type === "MUSICNAMEID_CHANGE"){
        return action.payload
    }else{
        return state
    }
}
// 歌曲播放状态管理
function isMusicPlayReducer(state=false,action){
    if( action.type === "ISMUSICPLAY_CHANGE" ){
        return action.payload
    }else{
        return state
    }
}
// header的头部歌曲名称状态管理
function musicNameReducer(state='巅峰榜 · 热歌' , action){
    if( action.type === 'MUSICNAME_CHANGE'){
        return action.payload
    }else{
        return state
    }
}

var reducers = combineReducers({
    headerArrow: headerArrowReducer,
    musicNameId: musicNameIdReducer,
    isMusicPlay: isMusicPlayReducer,
    musicName: musicNameReducer
})
var store = createStore(reducers,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store