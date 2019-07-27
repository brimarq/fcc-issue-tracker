const crypto = require('crypto');
const { execSync } = require('child_process')

function createComparisonSignature (body) {
  const hmac = crypto.createHmac('sha1', process.env.SECRET);
  const self_signature = hmac.update(JSON.stringify(body)).digest('hex');
  return `sha1=${self_signature}`; // shape in GitHub header
}

function compareSignatures (signature, comparison_signature) {
  let source, comparison;
  if (signature.length !== comparison_signature.length) { return false }
  source = Buffer.from(signature);
  comparison = Buffer.from(comparison_signature);
  return crypto.timingSafeEqual(source, comparison); // constant time comparison
}

function verifyGithubPayload (req, res, next) {
  const { headers, body } = req;
  const signature = headers['x-hub-signature'] || '';
  const comparison_signature = createComparisonSignature(body);
  const isVerifiedSignature = compareSignatures(signature, comparison_signature);

  if (!isVerifiedSignature) {
    return res.status(401).send('Mismatched signatures');
  }

  next();
};


function eventHandler (req, res) {
  const repoUrl = req.body.repository.git_url;
  const repoBranch = process.env.PULL_BRANCH || 'master';
  const gitPull = `git checkout -- ./ && git pull -X theirs ${repoUrl} ${repoBranch} && refresh`;
  const output = execSync(gitPull).toString();
  console.log(output);
  return res.send();
};

module.exports = function (app) {
  app.post('/glitch-deploy', verifyGithubPayload, eventHandler);
};