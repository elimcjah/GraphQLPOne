const comments = [
    {
        id: '1',
        text: 'text for 1',
        author: '3',
        post: '1'
    },{
        id: '2',
        text: 'text for 2',
        author: '3',
        post: '2'
    },{
        id: '3',
        text: 'text for 3',
        author: '3',
        post: '3'
    },{
        id: '4',
        text: 'text for 4',
        author: '1',
        post: '2'
    }
];

const users = [
    {
        id: '1',
        name: 'Mekala Deanne Smith',
        email: 'mekala@smith.com',
        age: 57
    },{
        id: '2',
        name: 'Michael Gene McClendon',
        email: 'mgm@yahoo.com'
    },{
        id: '3',
        name: 'William Kyle McClendon',
        email: 'cal@gmail.com'
    }
];

const posts = [
    {
        id: '1',
        title: 'This is a title',
        body: 'Body of the post is here.',
        published: true,
        author: '3'
    },{
        id: '2',
        title: 'E equals MC Squared',
        body: 'Albert Einstein',
        published: true,
        author: '1'
    },{
        id: '3',
        title: 'The Law of Murphy',
        body: 'Murphy had many laws.  This one is the Best.',
        published: false,
        author: '2'
    }
];

let db = {
    users,
    posts,
    comments
}

export {db as default}