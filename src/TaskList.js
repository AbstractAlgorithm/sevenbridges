import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
  Link,
} from 'react-router-dom';

class TaskList extends Component {
    state = {
        tasks: [],
        limit: 0,
        status: 'ANY',
        userInfo: {},
    }

    fetchUserInformation = () => {
        fetch(`https://cavatica-api.sbgenomics.com/v2/users/abstractalgo`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-SBG-Auth-Token': 'dd602f26153d49b0bbcbab5714b66eef',
            },
        })
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    userInfo: response
                })
            }).catch((error) => {
                console.error(error)
            })
    }
    fetchTasks = () => {
        let limitStr = (0==this.state.limit?'':`limit=${this.state.limit}`)
        let statusStr = (this.state.status==='ANY'?'':`status=${this.state.status}`)
        let params = [limitStr, statusStr].filter(p=>p)
        params = (params.length!==0)
            ? '&' + params.join('&')
            : ''
        fetch(`https://cavatica-api.sbgenomics.com/v2/tasks?project=abstractalgo/cc-of-smart-variant-filtering${params}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-SBG-Auth-Token': 'dd602f26153d49b0bbcbab5714b66eef',
            },
        })
            .then((response) => response.json())
            .then((response) => {
                // console.log(response.items)
                this.setState({
                    tasks: response.items
                })
            }).catch((error) => {
                console.error(error)
            })
    }

    componentDidMount() {
        this.fetchTasks()
        this.fetchUserInformation()

        if (this.props.location.search==='?task-del-success') {
            this._showMsg = true
            this.props.history.replace(this.props.history.state, document.title, '/')
        }
    }

    render() {
        return (
            <div className="tasklist">
                {
                    (this.props.location.search==='?task-del-success' || this._showMsg)
                        ? <div className="deletemsg">Task deleted successfully.</div>
                        : null
                }
                <p>
                    <span>Limit:
                        <select
                            selected={this.state.limit}
                            onChange={e=>{
                                this.setState({limit: e.target.value}, ()=>{
                                    this.fetchTasks()
                                })
                            }}
                        >
                            <option value="0">None</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                        </select>
                    </span>

                    <span>Status:
                        <select
                            selected={this.state.status}
                            onChange={e=>{
                                this.setState({status: e.target.value}, ()=>{
                                    this.fetchTasks()
                                })
                            }}
                        >
                            <option value="ANY">Any</option>
                            <option value="QUEUED">Queued</option>
                            <option value="DRAFT">Draft</option>
                            <option value="RUNNING">Running</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="ABORTED">Aborted</option>
                            <option value="FAILED">Failed</option>
                        </select>
                    </span>
                </p>

                <h2>{(this.state.userInfo.username?`${this.state.userInfo.username}'s tasks (${this.state.tasks.length})`:'Task list')}</h2>
                {
                    (this.state.tasks.length===0)
                        ? <p>No tasks to show.</p>
                        : (
                            <div>
                                {
                                    this.state.tasks.map(
                                        task => <div key={task.id}>
                                                    <Link to={`/task/${task.id}`}>{task.name}</Link>
                                                </div>
                                    )
                                }
                            </div>
                        )
                }
            </div>
        )
    }
}

export default withRouter(TaskList)