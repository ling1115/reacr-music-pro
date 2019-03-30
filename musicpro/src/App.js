import React, { Component } from 'react';
import Header from './components/header/Header.js';
import List from './components/list/List.js';
import Lyric from './components/lyric/Lyric.js';
import Audio from './components/audio/Audio.js';
import Pic from './components/pic/Pic.js';

import { BrowserRouter as Router , Switch , Route , Redirect} from 'react-router-dom'

class App extends Component {
  render() {
    return (
		<Router>
			<div id='main'>
				<Header />
				<Switch>	
					<Route path='/list' component={List} />
					<Route path="/lyric/:id" component={ Lyric } />
					<Route path='/pic/:id' component={Pic} />
					<Redirect from='/*' to='/list' />
				</Switch>
				<Audio />
			</div>
		</Router>
		
    );
  }
}

export default App;
