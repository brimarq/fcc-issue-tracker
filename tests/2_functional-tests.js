/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  let testId1, testId2;
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
        const issue = {
          title: 'Title',
          text: 'text',
          creator: 'Functional Test - Every field filled in',
          assignee: 'Chai and Mocha',
          status: 'In QA',
          open: true
        };
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: issue.title,
          issue_text: issue.text,
          created_by: issue.creator,
          assigned_to: issue.assignee,
          status_text: issue.status
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id', 'Issue should contain _id');
          assert.property(res.body, 'issue_title', 'Issue should contain issue_title');
          assert.property(res.body, 'issue_text', 'Issue should contain issue_text');
          assert.property(res.body, 'created_by', 'Issue should contain created_by');
          assert.property(res.body, 'assigned_to', 'Issue should contain assigned_to');
          assert.property(res.body, 'status_text', 'Issue should contain status_text');
          assert.property(res.body, 'open', 'Issue should contain open');
          assert.property(res.body, 'created_on', 'Issue should contain created_on');
          assert.property(res.body, 'updated_on', 'Issue should contain updated_on');
          assert.equal(res.body.issue_title, issue.title);
          assert.equal(res.body.issue_text, issue.text);
          assert.equal(res.body.created_by, issue.creator);
          assert.equal(res.body.assigned_to, issue.assignee);
          assert.equal(res.body.status_text, issue.status);
          assert.equal(res.body.open, issue.open);
          testId1 = res.body._id;
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        const issue = {
          title: 'Title',
          text: 'text',
          creator: 'Functional Test - Required fields filled in',
          assignee: '',
          status: '',
          open: true
        };
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: issue.title,
          issue_text: issue.text,
          created_by: issue.creator,
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id', 'Issue should contain _id');
          assert.property(res.body, 'issue_title', 'Issue should contain issue_title');
          assert.property(res.body, 'issue_text', 'Issue should contain issue_text');
          assert.property(res.body, 'created_by', 'Issue should contain created_by');
          assert.property(res.body, 'assigned_to', 'Issue should contain assigned_to');
          assert.property(res.body, 'status_text', 'Issue should contain status_text');
          assert.property(res.body, 'open', 'Issue should contain open');
          assert.property(res.body, 'created_on', 'Issue should contain created_on');
          assert.property(res.body, 'updated_on', 'Issue should contain updated_on');
          assert.equal(res.body.issue_title, issue.title);
          assert.equal(res.body.issue_text, issue.text);
          assert.equal(res.body.created_by, issue.creator);
          assert.equal(res.body.assigned_to, issue.assignee);
          assert.equal(res.body.status_text, issue.status);
          assert.equal(res.body.open, issue.open);
          testId2 = res.body._id;
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing inputs');
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send()
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no updated field sent');
          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: testId1,
          issue_text: 'text-updated',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'successfully updated');
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: testId2,
          status_text: 'Solved',
          open: false
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'successfully updated');
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          if (!res.body.length) return done();
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({open: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          if (!res.body.length) return done();
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({open: false, assigned_to: 'Chai and Mocha'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          if (!res.body.length) return done();
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: ''
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '_id error');
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: testId2
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, `deleted ${testId2}`);
          done();
        });
      });
      
    });

});
