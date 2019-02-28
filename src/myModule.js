const message = 'some message from myModule.js';

const name = 'Elijah';

const location = 'Boulder';

const getGreeting = (name) => {
  return `Welcome To the Jungle, ${name}!`;
}

export { getGreeting, message, name, location as default}