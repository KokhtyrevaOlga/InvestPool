var InvestPool = artifacts.require("./InvestPool.sol");
var Project = artifacts.require("./Project.sol")

module.exports = function(deployer) {
  deployer.deploy(InvestPool, '0x123', 1, 2, 3, 4, 5, 6, '0x321', 5, 6, 7);
  deployer.deploy(Project);
};