pragma solidity ^0.7.1;
pragma experimental ABIEncoderV2;
import "./interfaces/OCRCallback.sol";
import "./interfaces/ResultCallback.sol";
import "./OffchainAggregator.sol";
import "./centralized-oracle-lib/ChainlinkClient.sol";
import "./ocr-lib/LinkTokenInterface.sol";


contract RequestManager is OCRCallbackInterface, ChainlinkClient {

    using Chainlink for Chainlink.Request;
    uint256 public dataFetchLinkCost;

    struct Request{
        //static parameters
        address requester;
        bool callbackValue;
        uint128 dataHash; //hash of amountDeposited
        uint256 OCRstartTime;
        uint256 OCRendTime;
        uint256 dataReceivedTime;
        address respondingOracle;
        // application-dependent parameter
        uint256 depositTime;
        uint256 amountDeposited;
        address user;
    }
    
    event NewRequest(uint64 rId);
    event DataReceived(string msg, uint64 roundID);
  
    uint64 public reqId = 0;
    mapping(uint64 => Request) public requestsQueue;
    uint64 private firstReqID = 0;
    uint64 private lastReqID = 0;


    uint256 public maxReqTime;
    uint64 public currReq = 0;

    bytes32 public jobID;
    address public DRcontract;
    OffchainAggregator public OCRcontract;
    LinkTokenInterface public link;


    /*
   * @param _dataFetchLinkCost cost of requesting the corresponding data of a given hash 
   * @param _DRcontract address of the Operator.sol contract used to request data on a given hash 
   * @param _jobID jonID specified on the oracle to interact vith the Operator.sol
   * @param _link link token address
   */
    constructor (uint256 _dataFetchLinkCost, address _DRcontract, bytes32 _jobID, address _link)
    {
        DRcontract = _DRcontract;
        dataFetchLinkCost = _dataFetchLinkCost;
        setChainlinkToken(_link);
        setChainlinkOracle(_DRcontract);
        jobID = _jobID;
        link = LinkTokenInterface(_link);
    }


    function makeObservation(uint256 _depositTime, address _user, bool callbackValue)
    public
    returns(uint64)
    {
        /*require((address(callbackAddr)==address(0) || address(callbackAddr)==msg.sender), 
            "The callback contract must have the same address as the requester");*/

        require(link.transferFrom(msg.sender, address(this), dataFetchLinkCost), "Error: insufficient LINK funds");

        reqId++;
        lastReqID = reqId;
        Request memory newRequest = Request(msg.sender, callbackValue, 0, 0, 0, 0, address(0), 0, 0, _user);
        requestsQueue[reqId] = newRequest;
        tryNewRound();
        return reqId;
    }

    function tryNewRound()
    public
    {
        uint256 _now = block.timestamp;
        if( (currReq==0 || requestsQueue[currReq].OCRstartTime+maxReqTime<_now) && firstReqID<lastReqID ){
            firstReqID++;
            currReq = firstReqID;
            requestsQueue[currReq].OCRstartTime = _now;
            OCRcontract.requestNewRound(msg.sender);
            emit NewRequest(firstReqID);
        }
    }

    function hashCallback(uint64 id, uint128 data) //
    external
    override
    {
       requestsQueue[id].dataHash = data;
       requestsQueue[id].OCRendTime = block.timestamp;
       currReq = 0;
       requestActualData(id, data); 
       tryNewRound();
    }


    function requestActualData(uint64 rid, uint128 vhash) 
    public
    {
        Chainlink.Request memory req = buildChainlinkRequest(jobID, address(this), this.dataCallback.selector);
        req.add("hash",uint2str(vhash));
        req.add("rid",uint2str(rid));
        sendChainlinkRequest(req, dataFetchLinkCost);
    }


    function dataCallback(bytes32 requestID, uint amount, address sender, uint64 queueID) 
    public
    {        
        require(requestsQueue[queueID].dataReceivedTime==0, "Error: data not needed");
        bytes16 resHash = bytes16(keccak256(toBytes(amount)));
        require(uint128(resHash)==requestsQueue[queueID].dataHash, "Error: received value do not match the hash");
        requestsQueue[queueID].amountDeposited = uint(amount);
        requestsQueue[queueID].dataReceivedTime = block.timestamp;
        requestsQueue[queueID].respondingOracle = sender;
        /*if(address(requestsQueue[queueID].callbackAddress)!=address(0))
            requestsQueue[queueID].callbackAddress.result(queueID, amount);*/
        emit DataReceived("New data received", queueID);
    }

    function getRequest(uint64 _reqID)
    public
    view
    returns(Request memory)
    {
        return requestsQueue[_reqID];
    }


    function setOCRcontract(address addr)
    public
    {
        OCRcontract = OffchainAggregator(addr);
    }
    
    
    function setMaxReqTime(uint256 time)
    public
    {
        maxReqTime = time;
    }


    function ququeSize()
    external
    view
    returns(int)
    {
        return lastReqID - firstReqID;
    }


    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function toBytes(uint256 x) public returns (bytes memory b) {
        b = new bytes(32);
        assembly { mstore(add(b, 32), x) }
    }
}
