// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TimedCrowdsale.sol";
import "../math/SafeMath.sol";

/**
 * @title IncreasingPriceCrowdsale
 * @dev Extension of Crowdsale contract that increases the price of tokens linearly in time.
 * Note that what should be provided to the constructor is the initial and final _rates_, that is,
 * the amount of tokens per wei contributed. Thus, the initial rate must be greater than the final rate.
 */
abstract contract IncreasingPriceCrowdsale is TimedCrowdsale {
    using SafeMath for uint256;

    uint256[] private _timestamps;
    uint256[] private _rates;

    /**
     * @dev Constructor, takes initial and final rates of tokens received per wei contributed.
     */
    constructor (uint256[] memory timestamps, uint256[] memory rates) {
        require(rates[rates.length - 1] > 0, "IncreasingPriceCrowdsale: final rate is 0");
        require(timestamps.length >= 2, 'Atleast two timestamps are needed!');
        require(timestamps.length == rates.length + 1, 'There must be one more timestamp than rate!');
        
        for(uint i=0; i<timestamps.length - 1; i++) {
            require(timestamps[i] < timestamps[i+1], 'Timestamps must be in chronologic order!');
        }
        
        for(uint i=0; i<rates.length - 1; i++) {
            require(rates[i] > rates[i+1], 'Rates must be decreasing!');
        }
        
        _timestamps = timestamps;
        _rates = rates;
    }

    /**
     * The base rate function is overridden to revert, since this crowdsale doesn't use it, and
     * all calls to it are a mistake.
     */
    function rate() public view virtual override returns (uint256) {
        revert("IncreasingPriceCrowdsale: rate() called");
    }

    /**
     * @return the initial rate of the crowdsale.
     */
  
    /**
     * @dev Returns the rate of tokens per wei at the present time.
     * Note that, as price _increases_ with time, the rate _decreases_.
     * @return The number of tokens a buyer gets per wei at a given time
     */
    function getCurrentRate() public view returns (uint256) {
        if (!isOpen()) {
            return 0;
        }
        
        uint phase = 0;
        for(uint i = 1; i < _timestamps.length - 1; i++) {
            if(_timestamps[i] < block.timestamp) {
                phase++;
            }
        }

        return _rates[phase];
    }

    /**
     * @dev Overrides parent method taking into account variable rate.
     * @param weiAmount The value in wei to be converted into tokens
     * @return The number of tokens _weiAmount wei will buy at present time
     */
    function _getTokenAmount(uint256 weiAmount) internal view virtual override returns (uint256) {
        uint256 currentRate = getCurrentRate();
        return currentRate.mul(weiAmount);
    }
}
