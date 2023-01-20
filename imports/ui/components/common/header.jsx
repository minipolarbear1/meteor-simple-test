import React from "react";
import {TasksCollection} from "../../../api/tasks/conllections/TasksCollection";

export const Header = () => {


    const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

    const pendingTasksTitle = `${
        pendingTasksCount ? `(${pendingTasksCount})` : ''
    }`;

    return (
        <header>
            <div className="app-bar">
                <div className="app-header">
                    <h1>📝️ To Do List</h1>
                    {pendingTasksTitle}
                </div>
            </div>
        </header>
    );
};