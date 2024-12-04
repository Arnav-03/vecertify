// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DocumentVerification", (m) => {
  // Deploy the DocumentVerification contract
  const DocumentVerification = m.contract("DocumentVerification");

  // Return the deployed contract for potential reference
  return { DocumentVerification };
});