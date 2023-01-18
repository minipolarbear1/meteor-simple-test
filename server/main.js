import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from "../imports/api/tasks/conllections/TasksCollection";
import '/imports/startup/both/index'
import '/imports/startup/server/index'
// import '/imports/api/tasks/server/tasksMethods'
// import '/imports/api/tasks/server/publications/tasksPublications'
const insertTask = (taskText, user) =>
    TasksCollection.insert({
        text:taskText,
        userId: user._id,
        createdAt: new Date(),
    });

//로그인 시 필요한 ID, PW 설정
const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password'

Meteor.startup(() => {
    //실행 시 자동으로 DB에 ID, PW 저장 (회원가입 기능이 없어 자동 저장)
    if(!Accounts.findUserByUsername(SEED_USERNAME)){
        Accounts.createUser({
            username: SEED_USERNAME,
            password: SEED_PASSWORD,
        });
    }

    ServiceConfiguration.configurations.upsert(
        {service: 'github'},
        {
            $set: {
                loginStyle: 'popup',
                clientId: 'c20ad24749a7ba7d8b47', //github OAuth 응용 프로그램 등록 후 발급 받는 clientId
                secret: '7cc8ae76c921a51dc2c7a0b48de8735d84066464'//github OAuth 응용 프로그램 등록 후 발급 받는 secret
            },
        }
    );

    const user = Accounts.findUserByUsername(SEED_USERNAME);
    //ID, PW 저장 후 Tasks 컬렉션을 조회하여 데이터가 없으면 컬렉션 초기화
    if(TasksCollection.find().count() === 0){
        [
            'First Task',
            'Second Task',
            'Third Task',
            'Fourth Task',
            'Fifth Task',
            'Sixth Task',
            'Seventh Task'
        ].forEach(taskText => insertTask(taskText, user))
    }
});