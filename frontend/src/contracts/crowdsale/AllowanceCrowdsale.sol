// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Crowdsale.sol";
import "../token/IERC20.sol";
import "../token/SafeERC20.sol";
import "../math/SafeMath.sol";
import "../math/Math.sol";

/**
 * @title AllowanceCrowdsale
 * @dev Extension of Crowdsale where tokens are held by a wallet, which approves an allowance to the crowdsale.
 */
abstract contract AllowanceCrowdsale is Crowdsale {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address internal _tokenWallet;

    /**
     * @dev Constructor, takes token wallet address.
     * @param initTokenWallet Address holding the tokens, which has approved allowance to the crowdsale.
     */
    constructor (address initTokenWallet) {
        require(initTokenWallet != address(0), "AllowanceCrowdsale: token wallet is the zero address");
        _tokenWallet = initTokenWallet;
    }

    /**
     * @return the address of the wallet that will hold the tokens.
     */
    function tokenWallet() public view returns (address) {
        return _tokenWallet;
    }

    /**
     * @dev Checks the amount of tokens left in the allowance.
     * @return Amount of tokens left in the allowance
     */
    function remainingTokens() public view returns (uint256) {
        return Math.min(token().balanceOf(_tokenWallet), token().allowance(_tokenWallet, address(this)));
    }

    /**
     * @dev Overrides parent behavior by transferring tokens from wallet.
     * @param beneficiary Token purchaser
     * @param tokenAmount Amount of tokens purchased
     */
    function _deliverTokens(address beneficiary, uint256 tokenAmount) internal virtual override {
        token().safeTransferFrom(_tokenWallet, beneficiary, tokenAmount);
    }
}
