// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./math/SafeMath.sol";
import "./ITaxes.sol";
import "./ownership/Ownable.sol";

contract Taxes is ITaxes, Ownable{
    using SafeMath for uint256;

    uint256 private _monkeyPool;
    uint256 private _marketingPool;
    uint256 private _prizePool;

    uint256 private _startTax = 40;
    uint256 private _baseTax = 10;    

    address private _tokenAddress; 
    address private _oldTaxesAddress;     

    uint256 private _marketingTax = 10;
    uint256 private _prizeTax = 10;
    uint256 private _poolTax = 80;

    modifier onlyMonkey() {
        require(msg.sender == _tokenAddress, "Monkey Call: Caller is not the monkey");
        _;
    }

    constructor(address tokenAddress) {
        _tokenAddress = tokenAddress;
    }

    function setOldTaxesAddress(address oldTaxesAddress) public override onlyMonkey {
        _oldTaxesAddress = oldTaxesAddress;
    }

    function getTaxrate(uint256 start, uint256 end) public view override returns(uint256) {
        if(end > block.timestamp && start < block.timestamp){
            return ((_startTax - _baseTax) * ((end - block.timestamp)*100 / (end - start))) / 100 + _baseTax;            
        }
        
        return _baseTax;   
    }

    function getMonkeyPool() public view override returns(uint256) {
        return _monkeyPool;
    }

    function taxTransaction(uint256 amount, uint256 start, uint256 end) public override onlyMonkey returns(uint256) { 
        uint256 value = getTaxrate(start, end);
        value = amount.mul(value).div(100);
        _addTaxesToPool(value);
        return value;
    }

    function _addTaxesToPool(uint256 value) internal {
        uint256 marketing = (value * _marketingTax) / 100;
        uint256 prize = (value * _prizeTax) / 100;
        
        _monkeyPool = _monkeyPool.add(value - marketing - prize);
        _marketingPool = _marketingPool.add(marketing);
        _prizePool = _prizePool.add(prize);
    }

    function drainPools(address newAddress) public override onlyMonkey {
        ITaxes(newAddress).allocatePools(_monkeyPool, _marketingPool, _prizePool);
        _monkeyPool = 0;
        _marketingPool = 0;
        _prizePool = 0;
    }

    function allocatePools(uint256 monkeyPool, uint256 marketingPool, uint256 prizePool) public override {
        require(msg.sender == _oldTaxesAddress, "Sender is not the old tax system");
        require(_oldTaxesAddress != address(0), "Sender is zero address");

        _monkeyPool = monkeyPool;
        _marketingPool = marketingPool;
        _prizePool = prizePool;
    }
}