// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./nft/ERC1155.sol";
import "./ownership/Ownable.sol";

contract MonkeyMoonNFT is ERC1155, Ownable{

    uint private _numTokens  = 0;
    mapping(uint => string) private _tokenURIs;

    constructor() ERC1155() Ownable(){
    }

    function mint(string memory uri_, uint amount) public {
        _mint(msg.sender, _numTokens, amount, "");
        _tokenURIs[_numTokens] = uri_;
        _numTokens += 1;
    }

    function uri(uint256 tokenId) override public view returns (string memory) {        
        return _tokenURIs[tokenId];
    }

    function numTokens() public view returns (uint) {
        return _numTokens;
    }
}