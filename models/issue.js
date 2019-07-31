const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IssueSchema = new Schema(
  {
    issue_title: {type: String, trim: true, required: true},
    issue_text: {type: String, trim: true, required: true},
    project: {type: String, trim: true, required: true},
    created_by: {type: String, trim: true, required: true},
    assigned_to: {type: String, default: ''},
    status_text: {type: String, default: ''},
    open: {type: Boolean, default: true}
  }, 
  {
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    minimize: false
  }
);

IssueSchema.methods.getPublicFields = function () {
  const returnObject = {
    _id: this._id,
    issue_title: this.issue_title,
    issue_text: this.issue_text,
    created_by: this.created_by,
    assigned_to: this.assigned_to,
    status_text: this.status_text,
    open: this.open,
    created_on: this.created_on,
    updated_on: this.updated_on
  };
  return returnObject;
};

module.exports = mongoose.model('Issue', IssueSchema);