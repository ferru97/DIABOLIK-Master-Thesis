pragma solidity ^0.7.1;
import "./interfaces/OCRCallback.sol";
import "./interfaces/ResultCallback.sol";
import "./OffchainAggregator.sol";
import "./centralized-oracle-lib/ChainlinkClient.sol";


contract ValuesTracker is OCRCallbackInterface, ChainlinkClient {

    using Chainlink for Chainlink.Request;
    uint256 public dataFetchLinkCost;
    bytes32 public jobID;
    address public dataOracle;

    struct Query{
        address requestesr;
        ResultCallbackInterface requesterCallback;
        string property;
        uint blockNum;
        address cont;
        uint128 dataHash;
        bytes data;
        uint startTime;
        uint endTime;
        uint dataReceivedTime;
        address dataOracle;
    }
    
    event NewRequest(uint64 rId);
  
    uint64 public reqId = 0;
    mapping(uint64 => Query) public reqQueue;
    uint64 private first = 0;
    uint64 private last = 0;


    uint256 public maxReqTime;
    uint64 public currReq = 0;

    OffchainAggregator public ocr;


    /*
   * @param _dataFetchLinkCost cost of requesting the corresponding data of a given hash 
   * @param _dataOracle address of the Operator.sol contract used to request data on a given hash 
   * @param _jobID jonID specified on the oracle to interact vith the Operator.sol
   * @param _link link token address
   */
    constructor (uint256 _dataFetchLinkCost, address _dataOracle, bytes32 _jobID, address _link)
    {
        dataOracle = _dataOracle;
        dataFetchLinkCost = _dataFetchLinkCost;
        setChainlinkToken(_link);
        setChainlinkOracle(_dataOracle);
        jobID = _jobID;
    }


    function checkValue(string calldata property, uint blockNum, address cont, ResultCallbackInterface callbackAddr)
    public
    returns(uint64)
    {
        require((address(callbackAddr)==address(0) || address(callbackAddr)==msg.sender), 
            "The callback contract must have the same address as the requester");

        reqId++;
        last = reqId;
        Query memory newQuery = Query(msg.sender, callbackAddr, property, blockNum, cont, 0, "", 0, 0, 0, address(0));
        reqQueue[reqId] = newQuery;
        checkNewRound();
        return reqId;
    }

    function checkNewRound()
    public
    {
        uint256 _now = block.timestamp;
        if( (currReq==0 || reqQueue[currReq].startTime+maxReqTime<_now) && first<last ){
            first++;
            currReq = first;
            reqQueue[currReq].startTime = _now;
            ocr.requestNewRound(msg.sender);
            emit NewRequest(first);
        }
    }

    function oraclesResult(uint64 id, uint128 data) 
    external
    override
    {
       reqQueue[id].dataHash = data;
       reqQueue[id].endTime = block.timestamp;
       currReq = 0;
       doRequest(id, data); 
       checkNewRound();
    }


    function doRequest(uint64 rid, uint128 vhash) 
    internal
    {
        Chainlink.Request memory req = buildChainlinkRequest(jobID, address(this), this.fulfill2.selector);
        req.add("hash",uint2str(vhash));
        req.add("rid",uint2str(rid));
        sendChainlinkRequest(req, dataFetchLinkCost);
    }


    function fulfill2(uint64 requestID, bytes calldata answer, address sender) 
    public
    {
        require(reqQueue[requestID].dataReceivedTime==0, "Error: data not needed");
        bytes16 resHash = bytes16(keccak256(answer));
        require(uint128(resHash)==reqQueue[requestID].dataHash, "Error: received value do not match the hash");
        reqQueue[requestID].data = answer;
        reqQueue[requestID].dataReceivedTime = block.timestamp;
        reqQueue[requestID].dataOracle = sender;
        if(address(reqQueue[requestID].requesterCallback)!=address(0))
            reqQueue[requestID].requesterCallback.result(requestID, answer);
    }


    function checkResult(uint64 id)
    external
    view
    returns(bytes memory)
    {
        return reqQueue[id].data;
    }


    function checkIfFinished(uint64 id)
    external
    view
    returns(uint256)
    {
        return reqQueue[id].endTime;
    }


    function setOCR(address addr)
    public
    {
        ocr = OffchainAggregator(addr);
    }
    
    
    function setMaxReqTime(uint256 time)
    public
    {
        maxReqTime = time;
    }


    function getCurrReqBlock()
    external
    view
    returns(uint256)
    {
        return reqQueue[currReq].blockNum;
    }


    function getCurrReqProperty()
    external
    view
    returns(string memory)
    {
        return reqQueue[currReq].property;
    }


    function getCurrReqContract()
    external
    view
    returns(address)
    {
        return reqQueue[currReq].cont;
    }


    function ququeSize()
    external
    view
    returns(int)
    {
        return last - first;
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
}
