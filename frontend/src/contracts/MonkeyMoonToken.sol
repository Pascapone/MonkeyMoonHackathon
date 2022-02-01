// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./token/ERC20.sol";
import "./token/ERC20Burnable.sol";
import "./ownership/Ownable.sol";
import "./math/SafeMath.sol";
import "./token/SafeERC20.sol";
import "./IMonkeyMoonToken.sol";
import "./ITaxes.sol";

contract MonkeyMoonToken is ERC20, ERC20Burnable, Ownable, IMonkeyMoonToken {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    mapping (uint256 => address) private _holders;
    mapping (address => bool) private _inHolder;
    mapping (address => uint) private _monkeyScore;

    uint256 private _holderCount = 0;

    uint256 private _initialSuppy = 100000000000;
    
    address private _icoAddress;

    address private _taxesAddress;

    address private _govAddress;

    uint256 private _taxStart = 1622746745;
    uint256 private _taxEnd = 1622747345;

    uint256 private _claimScoreGasCost = 0;

    mapping(address => bool) private _taxlessPermissions;
 
    constructor() ERC20("MonkeyMoon", "MMC") {
        _mint(msg.sender, _initialSuppy * 10**18);  
    }  

    // Transfer Functions
    function transfer(address recipient, uint256 amount) public override returns (bool) {  
        if(_taxlessPermissions[msg.sender]){
            _transfer(_msgSender(), recipient, amount);            
        }
        else{
            require(_taxesAddress != address(0), "Taxes not implemented. No tranfer atm");
            require(_taxStart != 0);
            _taxedTransfer(_msgSender(), recipient, amount, ITaxes(_taxesAddress).taxTransaction(amount, _taxStart, _taxEnd));           
        } 

        _setHolder(recipient);

        return true;       
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {     
        if(_taxlessPermissions[_msgSender()]){
            _transfer(sender, recipient, amount);
        }
        else{
            require(_taxesAddress != address(0), "Taxes not implemented. No tranfer atm");
            require(_taxStart != 0);
            _taxedTransfer(sender, recipient, amount, ITaxes(_taxesAddress).taxTransaction(amount, _taxStart, _taxEnd));
        }

        uint256 currentAllowance = allowance(sender, _msgSender());
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(sender, _msgSender(), currentAllowance - amount);
        }

        _setHolder(recipient);

        return true;
    }  

    function _setHolder(address recipient) internal {
        if(!_inHolder[recipient]){
            _inHolder[recipient] = true;
            _holders[_holderCount] = recipient;
            _holderCount++;
        }
    }

    // Goverment Functions
    function setGovAddress(address govAddress) public onlyOwner {
        require(_govAddress == address(0), "Gov address is locked");
        require(govAddress != address(0), "Gov address is the zero address");

        _govAddress = govAddress;
        _taxlessPermissions[govAddress] = true;
    }      

    function changeTaxesAddress(address newTaxesAddress) public override{
        require(msg.sender == _govAddress);
        require(_govAddress != address(0));

        ITaxes(_taxesAddress).setOldTaxesAddress(_taxesAddress);
        ITaxes(_taxesAddress).drainPools(newTaxesAddress);
        _taxesAddress = newTaxesAddress;
        _taxlessPermissions[newTaxesAddress] = true;
    }

    // Tax Functions
    function taxlessPermissionOf(address account) public view returns(bool) {
        return _taxlessPermissions[account];
    }

    function setTaxesAddress(address taxesAddress) public onlyOwner {
        require(_taxesAddress == address(0), "Taxes address is locked");
        require(taxesAddress != address(0), "Taxes address is the zero address");

        _taxesAddress = taxesAddress;  
        _taxlessPermissions[taxesAddress] = true;   
    }       

    function getTaxrate(uint256 start, uint256 end) public view returns(uint256) {
        return ITaxes(_taxesAddress).getTaxrate(start, end);
    } 

    function taxPool() public view returns(uint256) {
        return ITaxes(_taxesAddress).getMonkeyPool();
    }

    function setTaxStartEnd(uint[2] memory timestamps) public onlyOwner {
        _taxStart = timestamps[0];
        _taxEnd = timestamps[1];
    }

    function setVaultTaxless() public onlyOwner {
        _taxlessPermissions[IICO(_icoAddress).getVaultAddress()] = true;
    }

    // ICO Functions  
    function setICOAddress(address icoAddress) public onlyOwner {
        require(_icoAddress == address(0), "Ico address is locked");
        require(icoAddress != address(0), "Taxes address is the zero address");

        _icoAddress = icoAddress;
        _taxlessPermissions[icoAddress] = true;
    }    

    function getICOAddress() public view returns (address) {
        return _icoAddress;
    } 

    function monkeyScoreOf(address address_) public view returns (uint) {
        return _monkeyScore[address_];
    }

    modifier onlyOracle() {
        require(_oracleAddress == _msgSender(), "Only the oracle can call this function"); 
        _;       
    }

    // TESTING EVENT HOOKS AND ORACLE
    event MonkeyScoreClaimed(address sender);
    address private _oracleAddress = 0x6325096380A27BC2D602E78C02F84E7b26E694dE;

    function claimMonkeyScore() public payable {
        require(msg.value >= _claimScoreGasCost, "Not enough founds for the oracle");
        address payable payableAddress = payable(_oracleAddress);
        payableAddress.transfer(msg.value); 
        emit MonkeyScoreClaimed(_msgSender());
    }

    function writeScore(uint score, address beneficiary) public onlyOracle {     
        _monkeyScore[beneficiary] += score;
    }    

    function getClaimCost() public view returns (uint) {
        return _claimScoreGasCost;
    }

    function setClaimCost(uint oracleCost) public onlyOwner {
        _claimScoreGasCost = oracleCost;
    }
}

interface IICO {
    function getVaultAddress() external view returns(address);
}
