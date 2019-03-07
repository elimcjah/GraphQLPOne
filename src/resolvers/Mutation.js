import uuidv4 from "uuid/v4";

const Mutation = {
    createComment(parent, args, { db, pubSub }, info) {
        const userExists = db.users.some((user) => user.id === args.comment.author);
        const postExists = db.posts.some((post) => post.id === args.comment.post && post.published);

        if (!userExists) {
            throw new Error('User not found.')
        }

        if (!postExists) {
            throw new Error('Post not found or not published.')
        }

        const comment = {
            id: uuidv4(),
            ...args.comment
        };

        db.comments.push(comment);

        pubSub.publish(`comment ${args.comment.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        });

        return comment;
    },
    createPost(parent, args, { db, pubSub }, info) {
        const userExists = db.users.some((user) => user.id === args.post.author);

        if (!userExists) {
            throw new Error('User not found.')
        }

        const post = {
            id: uuidv4(),
            ...args.post
        };

        db.posts.push(post);
        if (args.post.published) {
            pubSub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            });
        }
        return post;
    },
    createUser(parent, args, { db }, info) {

        const emailTaken = db.users.some((user) => user.email === args.user.email);

        if(emailTaken) {
            throw new Error(`${args.user.email} is already registered.`)
        }

        const user = {
            id: uuidv4(),
            ...args.user
        };

        db.users.push(user);

        return user;
    },
    deleteComment(parnet, args, { db, pubSub }, info){
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id);

        if (commentIndex === -1) {
            throw new Error('Comment not found.');
        }
        const [deletedComment] = db.comments.splice(commentIndex, 1);
        pubSub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        });

        return deletedComment;
    },
    deletePost(parent, args, { db, pubSub }, info) {
        const postIndex = db.posts.findIndex((post) => post.id === args.id);

        if (postIndex === -1) {
            throw new Error('Post not found.');
        }

        const [post] = db.posts.splice(postIndex, 1);
        db.comments = db.comments.filter((comment) => comment.post !== args.id);

        if(post.published) {
            pubSub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post,
                }
            });
        }

        return post;
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex((user) => user.id === args.id);

        if (userIndex === -1) {
            throw new Error('User not found');
        }

        const deletedUsers = db.users.splice(userIndex, 1);

        db.posts = db.posts.filter((post) => {
            const match = post.author === args.id;

            if (match) {
                db.comments = db.comments.filter((comment) => comment.post !== post.id);
            }

            return !match;
        });

        db.comments = db.comments.filter((comment) => comment.author !== args.id);

        return deletedUsers[0];
    },
    updateComment(parent, args, { db, pubSub }, info){
        const {id, textEdits} = args;

        const comment = db.comments.find((comment) => comment.id === id);

        if (!comment) {
            throw new Error('Comment not found.');
        }

        if (typeof textEdits.text === 'string') {
            comment.text = textEdits.text;
        }
        pubSub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: "UPDATED",
                data: comment
            }
        });
        return comment;
    },
    updatePost(parent, args, { db, pubSub }, info){
        const { id, postEdits } = args;
        const post = db.posts.find((post) => post.id === id);
        const originalPost = { ...post };

        if (!post) {
            throw new Error('Post not found');
        }
        if (typeof postEdits.title === 'string') {
            post.title = postEdits.title;
        }
        if (typeof postEdits.body === 'string') {
            post.body = postEdits.body;
        }
        if (typeof postEdits.published === 'boolean') {
            post.published = postEdits.published;

            if(originalPost.published && !post.published) {
                // deleted
                pubSub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                });
            } else if (!originalPost.published && post.published) {
                pubSub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                });
            }
        } else if (post.published) {
            pubSub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            });
        }
        return post;
    },
    updateUser(parent, args, { db }, info) {
        const { id, userEdits } = args;
        const user = db.users.find((user) => user.id === id);

        if (!user) {
            throw new Error('User not found.');
        }
        if (typeof userEdits.email === 'string') {
            const emailTaken = db.users.some((user) => user.email === userEdits.email);
            if (emailTaken) {
                throw new Error('Email already in use');
            }
            user.email = userEdits.email;
        }
        if (typeof userEdits.name === 'string') {
            user.name = userEdits.name;
        }
        if (typeof userEdits.age !== 'undefined') {
            user.age = userEdits.age;
        }
        return user;
    },
};

export { Mutation as default};