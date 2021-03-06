# nightwatch-js-remote-assert

A library which adds remote assertions, fixtures, and test data to [Nightwatch](http://nightwatchjs.org)

This library is part of the tools available on https://graybox-testing.org. See that site for more information.

## What?

This library is intended to work with a backend such as [JUnit HTTP](https://github.com/dfox/junit-http). Check out that project for the rationale and how to set up the server component.

## How?

* Clone the JUnit HTTP repository and run the example application and test servers
* Clone this repo
* Run ```npm install```
* Download [Chromedriver](http://chromedriver.storage.googleapis.com/index.html) for your platfrom
* Download and run the standalone [Selenium client](http://selenium-release.storage.googleapis.com/index.html) according to the instructions on the [Nightwatch site](http://nightwatchjs.org/guide)

_Note:_ You'll need to put Chromedriver and the Selenium standalone server jar in the same directory; that's what the `nightwatch` config expects.

* Run ```node example.js```
* Run ```nightwatch```
* Check out the test output in the terminal

## Example

The example Express application (`/example.js`) serves up a simple front end for the example API in the JUnit HTTP project. The test included in `tests/example.js` exercises that application and shows how to use the included "assert.remote", "loadTestData", and "remoteFixture" functions work. For more information about how these work and why you want to use them, see the documentation for the backend at [JUnit HTTP](https://github.com/dfox/junit-http).

```javascript
const URL = 'http://localhost:8082'
const NAME_INPUT = 'input[id=note-name]'
const CONTENT_INPUT = 'textarea[id=note-content]'
const SAVE_BUTTON = 'button[id=save-button]'
const LOAD_BUTTON = 'button[id=load-button]'
const STATUS_ELEMENT = '#status'
const REMOTE_TEST_GROUP = 'io.dfox.junit.http.example.ExampleTest'
const TEST_DATA = 'notes.json'

module.exports = {
  'Notes can be saved' : browser => {
    browser.loadTestData(TEST_DATA, notes => {
      browser
        .url(URL)
        .waitForElementVisible('body', 1000)
        .setValue(NAME_INPUT, notes.save.name)
        .setValue(CONTENT_INPUT, notes.save.contents)
        .click(SAVE_BUTTON)
        .pause(1000)
        .assert.containsText(STATUS_ELEMENT, 'Saved note: ' + notes.save.name)
        .assert.remote(REMOTE_TEST_GROUP, 'noteSaved')
        .end();
    });
  },

  'Notes can be loaded' : browser => {
    browser.loadTestData(TEST_DATA, notes => {
      browser
        .url(URL)
        .waitForElementVisible('body', 1000)
        .setValue(NAME_INPUT, notes.load.name)
        .click(LOAD_BUTTON)
        .pause(1000)
        .assert.containsText(STATUS_ELEMENT, 'Loaded note: ' + notes.load.name)
        .assert.valueContains(CONTENT_INPUT, notes.load.contents)
        .end();
    });
  },

  'Notes can be loaded using fixture' : browser => {
    browser.loadTestData(TEST_DATA, notes => {
      browser
        .url(URL)
        .waitForElementVisible('body', 1000)
        .setValue(NAME_INPUT, notes.fixture.name)
        .click(LOAD_BUTTON)
        .pause(1000)
        .assert.containsText(STATUS_ELEMENT, 'Error loading note: Not Found')
        .assert.valueContains(CONTENT_INPUT, '')
        .remoteFixture(REMOTE_TEST_GROUP, 'createNote', () => {
          browser
            .click(LOAD_BUTTON)
            .pause(1000)
            .assert.containsText(STATUS_ELEMENT, 'Loaded note: ' + notes.fixture.name)
            .assert.valueContains(CONTENT_INPUT, notes.fixture.contents)
            .end();
        });
    });
  }
};

```

How does the assertion know where the test server is? You need to add the following block to the "globals" section of the configuration, which can be changed per environment:

```json
"test_settings" : {
  "default" : {
    "globals":{
      "remoteTest":{
        "server":{
          "host": "localhost",
          "port": 8081
        }
      }
    }
  }
}
```
