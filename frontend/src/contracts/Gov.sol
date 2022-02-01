// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./token/ERC20.sol";
import "./token/IERC20.sol";
import "./ownership/Ownable.sol";
import "./IMonkeyMoonToken.sol";

contract GOV is Ownable {
    enum ProposalType {Basic, ChangeTaxesAddress}
    
    struct Proposal {
        string name;
        uint256 start;
        uint256 end;
        ProposalType proposalType;
        uint64 upvotes;
        uint64 downvotes; 
        bool executed;        
        address addressToChange;
        uint256 value;
    }

    uint16 private _taxesAddressChangeThreshold = 66;

    address private _tokenAddress;
    uint256 private _votingThreshold = 1000 * 10 ** 18;
 
    uint32 public proposalNum = 0;
    mapping(uint32 => Proposal) private _proposals;
    mapping(address => uint256) private _votingTime;
    
    function addBasicProposal(string memory name, uint32 start, uint32 end) public onlyOwner {  
        _addProposal(Proposal(name, start, end, ProposalType.Basic, 0, 0 , false, address(0), 0));
    }

    function addTaxesProposal(string memory name, uint32 start, uint32 end, address newTaxesAddress) public onlyOwner {
        require(newTaxesAddress != address(0), "Taxes address is the zero address");       
        
        _addProposal(Proposal(name, start, end, ProposalType.ChangeTaxesAddress, 0, 0 , false, newTaxesAddress, 0));
    }

    function executeCurrentProposal() public onlyOwner() {
        require(_proposals[proposalNum].end <= block.timestamp, "Proposal hasnt ended yet");
        require(!_proposals[proposalNum].executed, "Proposal has already been executed");

        if(_proposals[proposalNum].proposalType == ProposalType.Basic){
            _proposals[proposalNum].executed = true;
        }
        else if(_proposals[proposalNum].proposalType == ProposalType.ChangeTaxesAddress){
            uint256 approval = (_proposals[proposalNum].upvotes * 100) / (_proposals[proposalNum].downvotes + _proposals[proposalNum].upvotes);
            
            if(approval >= _taxesAddressChangeThreshold){
                IMonkeyMoonToken(_tokenAddress).changeTaxesAddress(_proposals[proposalNum].addressToChange);
            }                
            _proposals[proposalNum].executed = true;
        }
    }
    
    function vote(bool accountVote) public {
        require(_proposals[proposalNum].start < block.timestamp, "Voting is not open");
        require(_proposals[proposalNum].end > block.timestamp, "Voting is closed");

        require(IERC20(_tokenAddress).balanceOf(msg.sender) >= _votingThreshold, "Not enough tokens for vorting rights");
        
        require(_votingTime[msg.sender] < _proposals[proposalNum].start, "Already voted");
        _votingTime[msg.sender] = block.timestamp;
        
        if(accountVote){
            _proposals[proposalNum].upvotes += 1;
        }
        else{
            _proposals[proposalNum].downvotes += 1;
        }
    }
    
    function getCurrentProposal() public view returns(Proposal memory) {
        return _proposals[proposalNum];
    }
    
    function getProposalByIndex(uint32 index) public view returns(Proposal memory) {
        require(index <= proposalNum, "Index out of range");
        return _proposals[index];
    }

    function _addProposal(Proposal memory proposal) internal {
        if(proposalNum > 0){
            require(_proposals[proposalNum].end < block.timestamp, "Current proposal needs to end before a new one can be created");
            require(_proposals[proposalNum].executed, "Current proposal has not been executed");
        }
        
        require(proposal.start > block.timestamp, "Proposal needs to be in the future");
        require(proposal.start < proposal.end, "End of proposal needs be after start");
        
        
        proposalNum++;
        _proposals[proposalNum] = proposal;
    }
}

