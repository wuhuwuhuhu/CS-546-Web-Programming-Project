const userData = require('./users');
const questionata = require('./questions');
const answerData = require('./answers');
const reviewData = require('./reviews');
const systemConfigData = require('./systemConfigs');
const updateMethodsData = require('./updateMethods')
const email = require('./email');
module.exports = {
  users: userData,
  questions: questionata,
  answers: answerData,
  reviews: reviewData,
  systemConfigs: systemConfigData,
  updateMethods:updateMethodsData,
  email: email
};
