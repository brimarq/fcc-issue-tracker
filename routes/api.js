/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const Issue = require('../models/issue');

function parseReqQueryObj(obj) {
  let parsedQuery = {};
  for (let [key, value] of Object.entries(obj)) {
    let val = value.toLowerCase();
    if (val === 'true' || val === 'false') {
      parsedQuery[key] = JSON.parse(val);
    } else {
      parsedQuery[key] = value;
    }
  } 
  return parsedQuery;
}

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res) {
      const project = req.params.project;
      const query = parseReqQueryObj(req.query);
      const filter = { project, ...query };

      Issue.find(filter, (err, issues) => {
        if (err) throw err;  
        res.send(issues.map(issue => issue.getPublicFields())); 
      });
      
    })
    
    .post(function (req, res) {
      const project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      let newIssue;

      if (!issue_title || !issue_text || !created_by) return res.status(400).send('missing inputs'); 
      
      newIssue = new Issue({ issue_title, issue_text, created_by, assigned_to, status_text, project });
      newIssue.save((err, issue) => {
        if (err) throw err;  
        res.send(issue.getPublicFields());
      });
    })
    
    .put(function (req, res){
      const isEmptyObj = (obj) => (Object.keys(obj).length ? false : true);
      const {_id, ...update} = req.body;

      if (isEmptyObj(req.body) || isEmptyObj(update)) return res.status(400).send('no updated field sent');

      if (!_id) return res.status(400).send('_id error');

      Issue.findOneAndUpdate({_id: {$eq: _id}}, update, {new: true}, (err, issue) => {
        if (err) res.status(500).send(`could not update ${_id}`);
        if (issue) res.send('successfully updated'); 
      });
      
    })
    
    .delete(function (req, res){
      const _id = req.body._id;

      if (!_id) return res.status(400).send('_id error');

      Issue.findOneAndDelete({_id: {$eq: _id}}, (err, issue) => {
        if (err) res.status(500).send(`could not delete ${_id}`); 
        if (issue) res.send(`deleted ${_id}`); 
      });
      
    });
    
};
