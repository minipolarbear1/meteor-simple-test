import React, {Fragment, useState} from "react";
import {TaskForm} from "../../components/task/TaskForm";
import {Task} from "../../components/task/Task";
import {TasksCollection} from "../../../api/tasks/conllections/TasksCollection";
import { useTracker } from 'meteor/react-meteor-data';

// CheckBox 선택 여부 체크
const toggleChecked = ({ _id, isChecked}) => {
    TasksCollection.update(_id, {
        $set: {
            isChecked: !isChecked
        }
    })
};
export const TaskPage = () =>{
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

    //최신순으로 정렬 sort 1: ASC, -1: DESC
    const tasks = useTracker(() =>{
        if(!user){
            return [];
        }
        return TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter, {
            sort: { createdAt: -1 },
        }).fetch();
    });

    //테스크 삭제
    const deleteTask = ({ _id}) => TasksCollection.remove(_id);

    const pendingTasksCount = useTracker(() => {
        if (!user) {
            return 0;
        }
        return TasksCollection.find(pendingOnlyFilter).count();
    });

    const pendingTasksTitle = `${
        pendingTasksCount ? `(${pendingTasksCount})` : ''
    }`;
    const logout = () => Meteor.logout();

    return(
        <Fragment>
            <div className="user" onClick={logout}>
                {user.username || user.profile.name}
            </div>

            <TaskForm user={user} />

            <div className="filter">
                <button onClick={() => setHideCompleted(!hideCompleted)}>
                    {hideCompleted? 'Show All' : 'Hide Completed'}
                </button>
            </div>

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
    )
}