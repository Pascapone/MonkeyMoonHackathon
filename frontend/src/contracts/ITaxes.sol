// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITaxes {
    function taxTransaction(uint256 amount, uint256 start, uint256 end) external returns(uint256);
    function getTaxrate(uint256 start, uint256 end) external view returns(uint256);
    function getMonkeyPool() external view returns(uint256);
    function drainPools(address newAddress) external;
    function allocatePools(uint256 monkeyPool, uint256 marketingPool, uint256 prizePool) external;
    function setOldTaxesAddress(address oldTaxesAddress) external;
}