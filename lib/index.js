var uuid = require('node-uuid');
var request = require('superagent');
var superagentJsonapify = require('superagent-jsonapify');
superagentJsonapify(request);


function Recovery (tenantUrl, recoveryUrl) {
  this.recoveryUrl = recoveryUrl;
  this.tenantUrl = tenantUrl;
}

Recovery.prototype.setupRequest = function(address, phone, email) {
  //1. get signature from tenant
  var sig;
  if (!this.tenantUrl) {
    var ethUtil = require('ethereumjs-util');
    var nonceBuffer = new Buffer(32);
    nonceBuffer.fill(0);
    uuid.v4(null, nonceBuffer, 16);
    var priv = new Buffer('privKey', 'hex');
    var addr = new Buffer(address, 'hex');
    var hash = ethUtil.sha3( Buffer.concat([addr, nonceBuffer]));
    sig = ethUtil.ecsign(hash, priv);
  } else {
    //do the API call to tenant backend
  }
  //2. send setup request to recovery
  var recoveryId = uuid.v4();
  var data = {
    address: '0x' + address,
    phone: phone,
    email: email,
    rTenant: '0x' + sig.r.toString('hex'),
    sTenant: '0x' + sig.s.toString('hex'),
    vTenant: sig.v,
    nonceTenant: uuid.unparse(nonceBuffer, 16)
  }
  var _this = this;
  return new Promise(function (fulfill, reject) {
    request
    .post(_this.recoveryUrl + '/setup/' + recoveryId)
    .set('Accept', 'application/json')
    .send(data)
    .on('error', function (err){
      reject(err);
    })
    .end(function(err, res) {
      if (err)
        reject(err);
      res.body.recoveryId = recoveryId;
      fulfill(res.body);
    });
  });
  //3. receive verificationId back
}

Recovery.prototype.confirm = function(code, verificationId) {
  //1. submit code and verificationId
  //2. receive hash of tx
  var _this = this;
  return new Promise(function (fulfill, reject) {
    request
    .post(_this.recoveryUrl + '/confirm/' + verificationId)
    .set('Accept', 'application/json')
    .send({ code: code })
    .end(function(err, res) {
      if (err)
        reject(err);
      res.body.verificationId = verificationId;
      fulfill(res.body);
    });
  });
  //3. listen on returned hash till mined
}

Recovery.prototype.recoveryRequest = function(oldAddress, newAddress, recoveryId) {
  //1. get signature from tenant
  var sig;
  if (!this.tenantUrl) {
    var ethUtil = require('ethereumjs-util');
    var nonceBuffer = new Buffer(32);
    nonceBuffer.fill(0);
    uuid.v4(null, nonceBuffer, 16);
    var priv = new Buffer('privKey', 'hex');
    var oldAddr = new Buffer(oldAddress, 'hex');
    var newAddr = new Buffer(newAddress, 'hex');
    var hash = ethUtil.sha3( Buffer.concat([oldAddr, newAddr, nonceBuffer]));
    sig = ethUtil.ecsign(hash, priv);
  } else {
    //do the API call to tenant backend
  }
  //2. send setup request to recovery
  var data = {
    oldAddr: '0x' + oldAddress,
    newAddr: '0x' + newAddress,
    rTenant: '0x' + sig.r.toString('hex'),
    sTenant: '0x' + sig.s.toString('hex'),
    vTenant: sig.v,
    nonceTenant: uuid.unparse(nonceBuffer, 16)
  }
  var _this = this;
  return new Promise(function (fulfill, reject) {
    request
    .post(_this.recoveryUrl + '/recovery/' + recoveryId)
    .set('Accept', 'application/json')
    .send(data)
    .end(function(err, res){
      if (err)
        reject(err);
      res.body.recoveryId = recoveryId;
      fulfill(res.body);
    });
  });
  //3. receive verificationId back
}

module.exports = Recovery;