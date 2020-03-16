/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */

after('Exit mocha gracefully after finishing all tests execution', function () {
  console.log('Ran tests, exiting!');
  process.exit();
});
