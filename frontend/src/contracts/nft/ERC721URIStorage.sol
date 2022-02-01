// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721.sol";
import "../ownership/Ownable.sol";

/**
 * @dev ERC721 token with storage based token URI management.
 */
abstract contract ERC721URIStorage is ERC721, Ownable {
    using Strings for uint256;

    // Optional mapping for token URIs
    mapping (uint256 => string) private _tokenURIs; 
    mapping (uint256 => string) private _tokenNames;    
    mapping (uint256 => string) private _tokenCreators;

    // ID Counter 
    uint256 private _idCounter = 0;

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }

    function getTokenName(uint256 tokenId) public view virtual returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: Name for nonexistent token");
        return _tokenNames[tokenId];
    }

    function mintToken(address to, string memory mintedTokenURI, string memory tokenName, string memory tokenCreator) public onlyOwner {        
        _safeMint(to, _idCounter);
        _setTokenURI(_idCounter, mintedTokenURI);   
        _setTokenName(_idCounter, tokenName);
        _setTokenCreator(_idCounter, tokenCreator);
        _idCounter++;
    }

    function getName(uint256 tokenId) public view returns(string memory) {
        return _tokenNames[tokenId];
    }

    function getCreator(uint256 tokenId) public view returns(string memory) {
        return _tokenCreators[tokenId];
    }

    function getIdCounter() public view returns(uint256) {
        return _idCounter;
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function _setTokenName(uint256 tokenId, string memory tokenName) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: Name set of nonexistent token");
        _tokenNames[tokenId] = tokenName;
    }

    function _setTokenCreator(uint256 tokenId, string memory tokenCreator) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: NFT creator set of nonexistent token");
        _tokenCreators[tokenId] = tokenCreator;
    }


    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);

        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
        if (bytes(_tokenNames[tokenId]).length != 0) {
            delete _tokenNames[tokenId];
        }
        if (bytes(_tokenCreators[tokenId]).length != 0) {
            delete _tokenCreators[tokenId];
        }
    }
}