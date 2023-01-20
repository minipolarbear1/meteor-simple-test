import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import {TasksCollection} from "../../conllections/TasksCollection";

Meteor.methods({
    'tasks.insert'(text){
        check(text, String);

        if (!this.userId){
            throw new Meteor.Error('Not authorized.');
        }

        TasksCollection.insert({
            text,
            createdAt: new Date,
            userId: this.userId,
        })
    },

    'tasks.remove'(taskId) {

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        const task = TasksCollection.findOne({ _id:taskId, userId: this.userId });

        if(!task){
            throw new Meteor.Error('Access denied.');
        }

        TasksCollection.remove(taskId);
    },

    'tasks.update'(taskId, text){
        check(text, String);

        if (!this.userId){
            throw new Meteor.Error('Not authorized.');
        }

        const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

        if (!task) {
            throw new Meteor.Error('Access denied.');
        }

        TasksCollection.update(taskId, {
            $set: {
                text:text
            }
        });

    },

    'tasks.setIsChecked'(taskId, isChecked) {
        check(taskId, String);
        check(isChecked, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

        if (!task) {
            throw new Meteor.Error('Access denied.');
        }


        TasksCollection.update(taskId, {
            $set: {
                isChecked
            }
        });
    },

    'task.findAll'(hideCompleted, pendingOnlyFilter, userFilter){

        if (!this.userId){
            throw new Meteor.Error('Not authorized.');
        }

        return TasksCollection.find(
            hideCompleted? pendingOnlyFilter : userFilter,
            {
                sort: { createdAt:-1 }
            }
        ).fetch();
    },

    'task.pendingTasksCount'(pendingOnlyFilter, userId){

        if (!userId){
            throw new Meteor.Error('Not authorized.');
        }

        return TasksCollection.find(pendingOnlyFilter).count();

    }
});