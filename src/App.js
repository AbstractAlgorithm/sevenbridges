import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
  Link,
} from 'react-router-dom';
import './App.css';
import TaskList from './TaskList.js'
import TaskDetails from './TaskDetails.js'

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" exact component={TaskList} />
                    <Route path="/task/:taskId" component={TaskDetails} />
                </Switch>
            </Router>
        )
    }
}

export default App;
