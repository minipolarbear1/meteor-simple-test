import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import {TasksCollection} from "../../../api/tasks/conllections/TasksCollection";

export const TaskForm = ({ user }) => {
    //사용하고자 하는 저장된 값 text 해당값 업데이트 시 setText
    const [text, setText] = useState('');

    const handleSubmit = e => {
        e.preventDefault()

        if(!text){
            return;
        }

        // //task 저장
        // TasksCollection.insert({
        //     text: text.trim(),
        //     createdAt: new Date(),
        //     userId: user._id,
        // });
        Meteor.call('tasks.insert', text);

        setText('');
    }

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Type to add new tasks"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <button type="submit">Add Task</button>
        </form>
    )
}