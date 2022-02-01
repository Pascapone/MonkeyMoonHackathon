// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./token/ERC20.sol";
import "./token/ERC20Burnable.sol";
import "./ownership/Ownable.sol";
import "./crowdsale/Crowdsale.sol";
import "./crowdsale/PostDeliveryCrowdsale.sol";
import "./crowdsale/IncreasingPriceCrowdsale.sol";
import "./crowdsale/TimedCrowdsale.sol";
import "./crowdsale/AllowanceCrowdsale.sol";
import "./math/SafeMath.sol";
import "./token/SafeERC20.sol";

contract ICO is Crowdsale, TimedCrowdsale, PostDeliveryCrowdsale, IncreasingPriceCrowdsale, AllowanceCrowdsale, Ownable {
    using SafeMath for uint256;

    uint256[] private _timestamps = [1622746385, 1622746565, 1622746745];
    uint256[] private _rates = [100, 10];

    uint256 private _investorCount = 0;
    mapping(address => bool) private _isIcoInvestor;
    
    address private _tokenAddress;  
    
    constructor(address tokenAddress, uint[] memory timestamps, uint[] memory rates, uint maxPruchaseAmount, uint minPruchaseAmount, uint maxIcoAmount) 
        Crowdsale(rates[0], payable(msg.sender), ERC20(payable(tokenAddress))) 
        TimedCrowdsale(timestamps[0], timestamps[timestamps.length - 1])
        PostDeliveryCrowdsale(maxPruchaseAmount, minPruchaseAmount, maxIcoAmount) 
        IncreasingPriceCrowdsale(timestamps, rates) 
        AllowanceCrowdsale(payable(msg.sender)) {
            _tokenAddress = tokenAddress;
            _timestamps = timestamps;
            _rates = rates;
        }   

    // Override Functions
    function _deliverTokens(address beneficiary, uint256 tokenAmount) internal override(Crowdsale, AllowanceCrowdsale) {
        AllowanceCrowdsale._deliverTokens(beneficiary, tokenAmount);
    }

    function _getTokenAmount(uint256 weiAmount) internal view override(Crowdsale, IncreasingPriceCrowdsale) returns (uint256) {
        return IncreasingPriceCrowdsale._getTokenAmount(weiAmount);
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override(Crowdsale, TimedCrowdsale, PostDeliveryCrowdsale) {
        PostDeliveryCrowdsale._preValidatePurchase(beneficiary, weiAmount);
    }

    function _processPurchase(address beneficiary, uint256 tokenAmount) internal override(Crowdsale, PostDeliveryCrowdsale) {
        PostDeliveryCrowdsale._processPurchase(beneficiary, tokenAmount);
    }
    
    function rate() public view override(Crowdsale, IncreasingPriceCrowdsale) returns (uint256) {
        return IncreasingPriceCrowdsale.rate();
    }

    // Interface Functions
    function getTimestamps() public view returns(uint256[] memory) {
        return _timestamps;
    }

    function getRates() public view returns(uint256[] memory) {
        return _rates;
    }

    function getVaultAddress() public view returns(address) {
        require(tx.origin == owner(), "Caller isnt owner");
        return _getVaultAddress();
    }  

    function getInvestors() public view returns(uint){
        return _investorCount;
    }

    function _postValidatePurchase(address beneficiary, uint256 weiAmount) internal override { 
        super._postValidatePurchase(beneficiary, weiAmount);
        if(!_isIcoInvestor[beneficiary]){
            _investorCount = _investorCount.add(1);
            _isIcoInvestor[beneficiary] = true;
        }        
    }
}
