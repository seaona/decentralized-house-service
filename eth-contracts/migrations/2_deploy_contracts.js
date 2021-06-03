// migrating the appropriate contracts
const SquareVerifier = artifacts.require("./SquareVerifier.sol");
const SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = async deployer => {
  deployer.deploy(SquareVerifier).then(() => { return deployer.deploy(SolnSquareVerifier, SquareVerifier.address)});

};
