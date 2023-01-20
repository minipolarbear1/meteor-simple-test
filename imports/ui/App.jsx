import React, {Fragment, useState} from 'react';
import {Meteor} from "meteor/meteor";
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '../api/tasks/conllections/TasksCollection';
import {LoginForm} from "./components/login/LoginForm";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {TaskPage} from "./containers/task/TaskPage";

export const App = () => {
    const user = useTracker(() => Meteor.user());

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

    const { pendingTasksCount } = useTracker(() => {
        const noDataAvailable = {pendingTasksCount: 0 };
        if (!Meteor.user()){
            return noDataAvailable;
        }
        const handler = Meteor.subscribe('tasks');

        if(!handler.ready()){
            return { ...noDataAvailable, isLoading: true };
        }

        const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

        return { pendingTasksCount };
    });

    const pendingTasksTitle = `${
        pendingTasksCount ? `(${pendingTasksCount})` : '' 
    }`;

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
                    <Routes>
                        {/*기본 루트는 로그인 페이지로 할당*/}
                        <Route path="/" element={<LoginForm/>}/>

                        <Route path="/task" element={<TaskPage/>}/>
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
};
