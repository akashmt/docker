import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Keycloak from 'keycloak-js';
import Logout from './Logout';
import axiosInstance from '../api/axiosInstance';

const Todo = props => (
    <tr>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_description}</td>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_responsible}</td>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_priority}</td>

        <td>
            <Link to={"/edit/"+props.todo._id}>Edit</Link>
        </td>
        
    </tr>
)

export default class TodosList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keycloak: null, 
            authenticated: false,
            todos: []
        };
    }

    componentDidMount() {
        const keycloak = Keycloak('/keycloak.json');
        keycloak.init({onLoad: 'login-required', checkLoginIframe: false}).then(authenticated => {
            this.setState({ keycloak: keycloak, authenticated: authenticated })
            if (authenticated) {
                window.accessToken = keycloak.token;
            }
        })
        axiosInstance.get('http://localhost:4000/todos/')
            .then(response => {
                this.setState({todos: response.data});
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.todos == this.state.todos) {
            axiosInstance.get('http://localhost:4000/todos/')
            .then(response => {
                this.setState({todos: response.data});
            })
            .catch(function (error) {
                console.log(error);
            })   
        }
    }

    todoList() {
        return this.state.todos.map(function(currentTodo, i) {
            return <Todo todo={currentTodo} key={i} />;
        });
    }

    render() {
        
        if(this.state.keycloak) {
            
            if(this.state.authenticated) return (
                <div>
                    <h3>Todos List</h3>
                    <table className="table table-striped" style={{ marginTop: 20 }}>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Responsible</th>
                                <th>Priority</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.todoList() }
                        </tbody>
                    </table>
                    <Logout keycloak={this.state.keycloak} />
                </div>
            ); else return (<div>Unable to authenticate!</div>)
        }
        return (
          <div>Initializing Keycloak...</div>
        );
      }
}