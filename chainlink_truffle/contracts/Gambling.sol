import "./RequestManager.sol";
import "./interfaces/ResultCallback.sol";
import "./ocr-lib/LinkTokenInterface.sol";
import "./DepositSelfLimitation.sol";
pragma solidity ^0.7.1;


contract Gambling is ResultCallbackInterface{

    event DepositResult(string message, address user);

    struct Deposit{
        uint256 totalAmountSent;
        uint256 desiredDeposit;
    }

    DepositSelfLimitation public userDepositLimitation;
    mapping(address => Deposit) public userPendingDeposit;
    mapping(address => uint256) public userBalance;

    address public contractOwner;

    RequestManager public requestManager;
    uint32 private secondsInOneMonth = 2592000;
    uint256 private dappBalance;
    uint256 private totalUsersBalance;

    LinkTokenInterface public link;
    uint256 public LINKperWei;

    uint256 public called = 0;

    modifier onlyOwner(){
        require(msg.sender == contractOwner, "Only the owner of the contract can access this function");
        _;
    }
    modifier onlyRequestManager(){
        require(msg.sender == address(requestManager), "Only the RequestManager-SC can access this function");
        _;
    }


    constructor(address _requestManager, uint256 _LINKperWei, address _link, address _userDepositLimitation)
    payable
    {
        requestManager = RequestManager(_requestManager);
        dappBalance += msg.value;
        contractOwner = msg.sender;
        LINKperWei = _LINKperWei;
        link = LinkTokenInterface(_link);
        userDepositLimitation = DepositSelfLimitation(_userDepositLimitation);
    }


    /**
     * @notice Initialize the deposit process
     * @param depositAmount amount of ETH the user wonts to add to his/her balance. Expressed in Wei
     */
    function deposit(uint256 depositAmount)
    public
    payable
    {
        require(depositAmount>0, "Error: The amount to deposit must be greater than 0");
        uint256 maxDepositFee = getMaxRequestETHCost();
        require(msg.value>depositAmount && msg.value-depositAmount>maxDepositFee, "Error: The amount to deposit is not enough to pay the deposit fee");

        requestManager.makeObservation(secondsInOneMonth, msg.sender);
        userPendingDeposit[msg.sender].desiredDeposit = depositAmount;
        userPendingDeposit[msg.sender].totalAmountSent = msg.value;
    }


    /**
     * @notice Callback function called by ReqManger-SC to return the result of a request concerning the amount
               of Ether a user has spent in the last month in gambling Dapps
     * @param user user on which the observation was requested
     * @param amountDeposited amount of ETH, expressed in Wei, that the user has spent at gambling Dapp in the last month
     * @param totalLinkPayed amount of LINK Gambling-SC has spent to make the request
     */
    function result(address payable user, uint256 amountDeposited, uint256 totalLinkPayed)
    external
    override
    onlyRequestManager
    {

        uint256 depositFee = totalLinkPayed / LINKperWei;
        if(depositFee < userPendingDeposit[user].totalAmountSent){
            userPendingDeposit[user].totalAmountSent -= totalLinkPayed;
            uint256 userMaxMountlyDeposit = userDepositLimitation.getSelfMonthlyLimitation(user);
            if(amountDeposited+userPendingDeposit[user].desiredDeposit <= userMaxMountlyDeposit){
                userBalance[user] += userPendingDeposit[user].desiredDeposit;
                userPendingDeposit[user].desiredDeposit = 0;
                emit DepositResult("Deposit completed successfully!", user);
            }else{
                emit DepositResult("Deposit canceled, you have exceeded your monthly limit", user);
            }
            uint256 remainingAmount = userPendingDeposit[user].desiredDeposit + userPendingDeposit[user].totalAmountSent;
            user.transfer(remainingAmount);
        }
        userPendingDeposit[user].desiredDeposit = 0;
        userPendingDeposit[user].totalAmountSent = 0;

    }


    /**
     * @notice Function that implements a simple gambling game. The user places a bet and if the function 
               randomly generates an even number, s/he wins, otherwise if it is odd s/he loses.
     * @param betAmount bet amount expressed in Wei
     */
    function playBet(uint256 betAmount)
    public
    returns(bool)
    {
        require(userBalance[msg.sender]>=betAmount, "Error: Not enough balance");
        require(dappBalance>=betAmount, "Error: The Dapp does not enough balance to cover the bet");

        uint8 random = uint8(uint256(keccak256( abi.encodePacked(block.timestamp, block.difficulty)))%251);
        bool outcome = rand()%2 == 0;
        if(outcome){
            userBalance[msg.sender] += betAmount;
            dappBalance -= betAmount;
        }else{
            userBalance[msg.sender] -= betAmount;
            dappBalance += betAmount;
        }
        return outcome;
    }



    /**
     * @notice Function called by both users and the contract owner to withdraw any winnings
     * @param amount amount of Wei to withdraw
     */
    function withdrawWin(uint256 amount)
    public
    {
        if(msg.sender==contractOwner){
            require(dappBalance>=amount, "Error: Not enough balance");
            dappBalance -= amount ;
            msg.sender.transfer(amount);
        }else{
            require(userBalance[msg.sender]>=0, "Error: Not enough balance");
            userBalance[msg.sender] -= amount;
            msg.sender.transfer(amount);
        }
    }



    // Setter functions

    function setRequestManager(address _requestManager)
    public
    onlyOwner
    {
        requestManager = RequestManager(_requestManager);
    }


    function setLinkPerWei(uint256 _LINKperWei)
    public
    onlyOwner
    {
        LINKperWei = _LINKperWei;
    }


    function fundDapp()
    public
    payable
    onlyOwner
    {
        require(msg.value > 0, "You must send some Eth to fund the contract");
        dappBalance += msg.value;
    }


    function approveLink(uint amount)
    public
    onlyOwner
    {
        link.approve(address(requestManager), amount);
    }


    function getMaxRequestETHCost()
    public
    view
    returns(uint256)
    {
        return requestManager.getMaxRequestLINKCost() / LINKperWei;
    }

    function getBalance()
    public
    view
    returns(uint256)
    {
        return address(this).balance;
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