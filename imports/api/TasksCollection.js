import {Mongo} from 'meteor/mongo';

// 컬렉션 생성
export const TasksCollection = new Mongo.Collection('tasks');