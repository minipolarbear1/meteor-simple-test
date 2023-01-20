import React from "react";
import { TasksCollection } from '../../../api/tasks/conllections/TasksCollection';

const updateTask = ({_id}) => {
    let updateTask = document.getElementById("updateTask");
    // TasksCollection.update(_id, {
    //     $set: {
    //         text:updateTask.value
    //     }
    // });
    Meteor.call('tasks.update', _id, updateTask.value);

}
export const Task = ({task, onCheckboxClick, onDeleteClick}) => {
    return (
        <li>
            <input
            type="checkbox"
            checked={!!task.isChecked}
            onClick={() => onCheckboxClick(task)}
            readOnly
            />
            {task.isChecked ?
                <input type="text" id="updateTask" defaultValue={task.text}/> :
                <span>{task.text}</span>
            }
            {task.isChecked ?
                <button onClick={ () => updateTask(task)}>수정</button>:
                ''
            }
            <button onClick={ () => onDeleteClick(task)}>&times;</button>
        </li>
    )
}