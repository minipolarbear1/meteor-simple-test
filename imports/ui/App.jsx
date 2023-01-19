import React, {Fragment, useState} from 'react';
import {Meteor} from "meteor/meteor";
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '../api/tasks/conllections/TasksCollection';
import { Task } from './components/task/Task'
import {TaskForm} from "./components/task/TaskForm";
import {LoginForm} from "./components/login/LoginForm";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {TaskPage} from "./containers/task/TaskPage";

// CheckBox 선택 여부 체크
const toggleChecked = ({ _id, isChecked}) => {
    // TasksCollection.update(_id, {
    //     $set: {
    //         isChecked: !isChecked
    //     }
    // })
    Meteor.call('tasks.setIsChecked', _id, !isChecked);
};
export const App = () => {
    const user = useTracker(() => Meteor.user());

    const [hideCompleted, setHideCompleted] = useState(false);

    const hideCompletedFilter = { isChecked: {$ne: true}}
    const userFilter = user ? { userId: user._id } : {};
    /*
    ...(Three dots) es6에서 새로 추가된 문법
    1. Three dots 함수가 매개변수의 끝에 있으면 "나머지 매개 변수" 이고 나머지 인수 목록을 배열로 수집
    2. 함수 호출 등에서 Three dots 사용하면 "확산 연산자" 라고 하며 배열을 목록으로 확장
    참고 사이트
    https://godnr149.tistory.com/150
    https://dinn.github.io/javascript/js-dotdotdot/
    */
    const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

    const { tasks, pendingTasksCount, isLoading } = useTracker(() => {
        const noDataAvailable = { tasks: [], pendingTasksCount: 0 };
        if (!Meteor.user()){
            return noDataAvailable;
        }
        const handler = Meteor.subscribe('tasks');

        if(!handler.ready()){
            return { ...noDataAvailable, isLoading: true };
        }

        const tasks = TasksCollection.find(
            hideCompleted? pendingOnlyFilter : userFilter,
            {
                sort: { createdAt:-1 }
            }
        ).fetch();
        // let tasks1;
        // let pendingTasksCount;
        const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

        // const pendingTasksCount = Meteor.call('task.pendingTasksCount', pendingOnlyFilter);
        // console.log("res = " + pendingTasksCount);
        // Meteor.call('task.findAll', hideCompleted, pendingOnlyFilter, userFilter, (err, res) => {
        //     // console.log("tasks err = "+ err);
        //     console.log("tasks res = " + res);
        //     console.log('Array Iteration 1')
        //     for (let i = 0; i < res.length; i++) {
        //         console.log(res[i])
        //     }
        //     // tasks1 = res;
        // });

        // Meteor.call('task.pendingTasksCount', pendingOnlyFilter, (err, res) => {
        //     pendingTasksCount = res;
        // });

        return { tasks, pendingTasksCount };
    });


    //최신순으로 정렬 sort 1: ASC, -1: DESC
    // const conllections = useTracker(() =>{
    //     if(!user){
    //         return [];
    //     }
    //     return TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter, {
    //         sort: { createdAt: -1 },
    //     }).fetch();
    // });

    //테스크 삭제
    // const deleteTask = ({ _id}) => TasksCollection.remove(_id); //기존(테스크(필드) 삭제)
    const deleteTask = ({ _id }) => Meteor.call('tasks.remove', _id); //변경(테스크(필드) 삭제)

    const pendingTasksTitle = `${
       pendingTasksCount ? `(${pendingTasksCount})` : '' 
    }`;
    const logout = () => Meteor.logout();

    return (
        <div className="app">
            <header>
                <div className="app-bar">
                    <div className="app-header">
                        <h1>📝️ To Do List</h1>
                        {pendingTasksTitle}
                    </div>
                </div>
            </header>

            <div className="main">
                <BrowserRouter>
                    {/*<Routes>*/}
                    {/*    /!*기본 루트는 로그인 페이지로 할당*!/*/}
                    {/*    <Route path="/" element={<LoginForm/>}/>*/}

                    {/*    <Route path="/task" element={<TaskPage/>}/>*/}
                    {/*</Routes>*/}
                    {user ?(
                        <Fragment>
                            <div className="user" onClick={logout}>
                                {user.username || user.profile.name}
                            </div>

                            <TaskForm />

                            <div className="filter">
                                <button onClick={() => setHideCompleted(!hideCompleted)}>
                                    {hideCompleted? 'Show All' : 'Hide Completed'}
                                </button>
                            </div>

                            {isLoading && <div className="loading">loading...</div> }

                            <ul className="tasks">
                                {tasks.map(task => (
                                    <Task
                                        key={task._id}
                                        task={task}
                                        onCheckboxClick={toggleChecked}
                                        onDeleteClick={deleteTask}
                                    />
                                ))}
                            </ul>
                        </Fragment>
                    ) : (
                        <LoginForm/>
                    )}
                </BrowserRouter>
            </div>
        </div>
    );
};
