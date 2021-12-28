import "./RequestManager.sol";
import "./interfaces/ResultCallback.sol";
pragma solidity ^0.7.1;


contract BetDapp is ResultCallbackInterface{

    mapping(address => uint256) public maxMounthDeposit;
    mapping(address => uint256) public userPendingDeposit;
    mapping(address => uint256) public userBalance;

    address public contractOwner;
    uint256 public minDepositLimit;

    RequestManager public requestManager;
    uint32 private secondsInOneMonth = 2592000;
    uint256 public dappBalance;

    modifier onlyOwner(){
        require(msg.sender == contractOwner, "Only the owner of the contract can access this function");
        _;
    }
    modifier onlyRequestManager(){
        require(msg.sender == address(requestManager), "Only the RequestManager-SC can access this function");
        _;
    }


    constructor(uint256 _minDepositLimit, address _requestManager)
    payable
    {
        minDepositLimit = _minDepositLimit;
        requestManager = RequestManager(_requestManager);
        dappBalance += msg.value;
    }

    function setDepositLimit(uint256 limit)
    public
    {
        require(limit>=minDepositLimit, "The deposit limit must be greater or equal to the minimum deposit limit");
        maxMounthDeposit[msg.sender] = limit;
    }



    function deposit(uint256 amount)
    public
    {
        requestManager.makeObservation(secondsInOneMonth, msg.sender);
        userPendingDeposit[msg.sender] += amount;
    }

    function result(address payable user, uint256 amountDeposited)
    external
    override
    onlyRequestManager
    {
        if(userPendingDeposit[msg.sender]>0){
            if(amountDeposited+userPendingDeposit[msg.sender] < maxMounthDeposit[user] ){
                userBalance[user] += amountDeposited+userPendingDeposit[msg.sender];
            }else{
                user.transfer(userPendingDeposit[msg.sender]);
            }
            userPendingDeposit[msg.sender] = 0;
        }
    }


    function playBet(uint256 betAmount)
    public
    returns(bool)
    {
        require(userBalance[msg.sender]>=betAmount, "Error: Not enough balance");
        require(dappBalance>=betAmount, "Error: The Dapp does not enough balance to cover the bet");

        uint8 random = uint8(uint256(keccak256( abi.encodePacked(block.timestamp, block.difficulty)))%251);
        bool outcome = rand() == 0;
        if(outcome){
            userBalance[msg.sender] += betAmount;
            dappBalance -= betAmount;
        }else{
            userBalance[msg.sender] -= betAmount;
            dappBalance += betAmount;
        }
        return outcome;
    }


    function withdrawWin()
    public
    {
        require(userBalance[msg.sender]>=0, "Error: Not enough balance");
        uint256 amountWin = userBalance[msg.sender];
        userBalance[msg.sender] = 0;
        msg.sender.transfer(amountWin);
    }



    // Setter functions
    function setMinDepositLimit(uint256 _minDepositLimit)
    public
    onlyOwner
    {
        minDepositLimit = _minDepositLimit;
    }

    function setRequestManager(address _requestManager)
    public
    onlyOwner
    {
        requestManager = RequestManager(_requestManager);
    }

    function fundDapp(address _requestManager)
    public
    payable
    onlyOwner
    {
        require(msg.value > 0, "You must send some Eth to fund the contract");
        dappBalance += msg.value;
    }

    // Random function used by Fomo3D
    function rand()
    public
    view
    returns(uint256)
    {
        uint256 seed = uint256(keccak256(abi.encodePacked(
            block.timestamp + block.difficulty +
            ((uint256(keccak256(abi.encodePacked(block.coinbase)))) / (block.timestamp)) +
            block.gaslimit + 
            ((uint256(keccak256(abi.encodePacked(msg.sender)))) / (block.timestamp)) +
            block.number
        )));

        return (seed - ((seed / 1000) * 1000));
    }
}