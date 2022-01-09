pragma solidity ^0.7.1;


contract DepositSelfLimitation {

    mapping(address => uint256) public depositSelfLimitation;
    address[] public gamblingDapps;
    address public contractOwner;

    modifier onlyOwner(){
        require(msg.sender == contractOwner, "Only the owner of the contract can access this function");
        _;
    }

    constructor()
    {
        contractOwner = msg.sender;
    }


    function setGamblingDapps(address[] memory _gamblingDapps)
    public
    onlyOwner
    {
        gamblingDapps = _gamblingDapps;
    }


    function setSelfMonthlyLimitation(uint256 selfLimitation)
    public
    {
        depositSelfLimitation[msg.sender] = selfLimitation;
    }


    function getSelfMonthlyLimitation(address user)
    public
    returns(uint256)
    {
        return depositSelfLimitation[user];
    }


    function getGamblingDappsList() 
    public
    view 
    returns(address[] memory) {
        return gamblingDapps;
    }

}