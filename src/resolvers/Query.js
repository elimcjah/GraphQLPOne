const Query = {
    me() {
        return {
            id: '123098',
            name: 'Michael',
            email: 'Michael@gmail.com'
        };
    },
    post() {
        return {
            id: '123487',
            title: 'The Thing',
            body: 'Lorem Ipsum',
            published: true,
            author: '2'
        }
    },
    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts;
        } else {
            return db.posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                return isBodyMatch || isTitleMatch;
            });
        }
    },
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users;
        } else {
            return db.users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            })
        }
    },
    comments(parent, args, { db }, info) {
        return db.comments;
    },
};

export { Query as default};