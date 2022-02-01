// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TimedCrowdsale.sol";
import "../math/SafeMath.sol";
import "../ownership/Secondary.sol";
import "../token/IERC20.sol";
import "../utils/Strings.sol";

/**
 * @title PostDeliveryCrowdsale
 * @dev Crowdsale that locks tokens from withdrawal until it ends.
 */
abstract contract PostDeliveryCrowdsale is TimedCrowdsale {
    using SafeMath for uint256;
    
    uint256 private _maxAmount;
    uint256 _minAmount; 
    uint _maxIcoAmount;

    mapping(address => uint256) private _balances;    
    __unstable__TokenVault private _vault;
    
    uint256 private _totalTokensInVault = 0;

    modifier amountLessThanMax(address beneficiary, uint256 weiAmount) {
        require(isLessThanMax(beneficiary, weiAmount), "Total amount exceeds max amount");
        _;
    }

    modifier amountMoreThanMin(uint256 weiAmount) {
        require(isMoreThanMin(weiAmount), "Was da los");
        _;
    }

    modifier amountLessThanMaxIco(uint256 weiAmount) {
        require(isLessThanMaxIco(weiAmount), "Total amount exceeds max ico amount");
        _;
    }

    constructor(uint256 maxAmount, uint256 minAmount, uint maxIcoAmount) {
        _vault = new __unstable__TokenVault();
        _maxAmount = maxAmount;
        _minAmount = minAmount;
        _maxIcoAmount = maxIcoAmount;
    }
    
    function isLessThanMax(address beneficiary, uint256 weiAmount) private view returns (bool) {
        bool allowed = _weiInvested[beneficiary] + weiAmount <= _maxAmount;
        return allowed;
    }

    function isMoreThanMin(uint256 weiAmount) private view returns (bool) {
        bool allowed = weiAmount >= _minAmount;
        return allowed;
    }

    function isLessThanMaxIco(uint256 weiAmount) private view returns (bool) {
        bool allowed = _weiRaised + weiAmount <= _maxAmount;
        return allowed;
    }

    /**
     * @dev Withdraw tokens only after crowdsale ends.
     * @param beneficiary Whose tokens will be withdrawn.
     */
    function withdrawTokens(address beneficiary) public {
        require(hasClosed(), "PostDeliveryCrowdsale: not closed");
        uint256 amount = _balances[beneficiary];
        require(amount > 0, "PostDeliveryCrowdsale: beneficiary is not due any tokens");

        _balances[beneficiary] = 0;
        _vault.transfer(token(), beneficiary, amount);
        _totalTokensInVault = _totalTokensInVault.sub(amount);
    }

    /**
     * @return the balance of an account.
     */
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function totalTokensInVault() public view returns (uint256) {
        return _totalTokensInVault;
    }

    function getMinBuyAmount() public view returns (uint256) {
        return _minAmount;
    }

    function getMaxBuyAmount() public view returns (uint256) {
        return _maxAmount;
    }

    function getMaxIcoAmount() public view returns (uint256) {
        return _maxIcoAmount;
    }
    
    /**
     * @dev Overrides parent by storing due balances, and delivering tokens to the vault instead of the end user. This
     * ensures that the tokens will be available by the time they are withdrawn (which may not be the case if
     * `_deliverTokens` was called later).
     * @param beneficiary Token purchaser
     * @param tokenAmount Amount of tokens purchased
     */
    function _processPurchase(address beneficiary, uint256 tokenAmount) internal virtual override {
        _balances[beneficiary] = _balances[beneficiary].add(tokenAmount);
        _deliverTokens(address(_vault), tokenAmount);
        _totalTokensInVault = _totalTokensInVault.add(tokenAmount);
    }
    
    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal virtual override amountLessThanMax(beneficiary, weiAmount) amountMoreThanMin(weiAmount) amountLessThanMaxIco(weiAmount) view {
        super._preValidatePurchase(beneficiary, weiAmount);   
    }

    function _getVaultAddress() internal view returns(address) {
        return address(_vault);
    }
}

/**
 * @title __unstable__TokenVault
 * @dev Similar to an Escrow for tokens, this contract allows its primary account to spend its tokens as it sees fit.
 * This contract is an internal helper for PostDeliveryCrowdsale, and should not be used outside of this context.
 */
// solhint-disable-next-line contract-name-camelcase
contract __unstable__TokenVault is Secondary {
    function transfer(IERC20 token, address to, uint256 amount) public onlyPrimary {
        token.transfer(to, amount);        
    }
}
