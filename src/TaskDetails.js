import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
  Link,
} from 'react-router-dom';

class TaskDetails extends Component {
    state = {
        task: {},
        errorMsg: null,
    }
    componentDidMount() {
        this.fetchTaskDetails()
    }
    fetchTaskDetails = () => {
        fetch(`https://cavatica-api.sbgenomics.com/v2/tasks/${this.props.match.params.taskId}`, {
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
                    task: response
                })
            }).catch((error) => {
                console.error(error)
            })
    }
    deleteTask = () => {
        if (!this.state.task || !this.state.task.id) {
            return
        }

        fetch(`https://cavatica-api.sbgenomics.com/v2/tasks/${this.state.task.id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-SBG-Auth-Token': 'dd602f26153d49b0bbcbab5714b66eef',
            },
        })
            .then((response) => {
                if (response.ok) {
                    this.props.history.push('/?task-del-success')
                } else {
                    return response.json().then(responseJSON => {
                        this.setState({
                            errorMsg: responseJSON.message
                        })
                    })
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }
    render() {
        return (
            <div className="taskdetails">
                <p><strong>Task name:</strong> {this.state.task.name}</p>
                <p><strong>Status:</strong> {this.state.task.status}</p>
                <p><strong>In project:</strong> {this.state.task.project}</p>
                {
                    (!this.state.task.id)
                        ? null
                        : (
                            <a
                                onClick={()=>{
                                    this.setState({
                                        errorMsg: null,
                                    }, ()=>{
                                        this.deleteTask()
                                    })}}
                            >Delete task</a>
                        )
                }
                {
                    (this.state.errorMsg)
                        ? <div className="msg">({this.state.errorMsg})</div>
                        : null
                }
            </div>
        )
    }
}

export default withRouter(TaskDetails)