pragma solidity ^0.7.1;
import "./interfaces/OCRCallback.sol";
import "./OffchainAggregator.sol";


contract ValuesTracker is OCRCallbackInterface {

    struct Query{
        address requestesr;
        OCRCallbackInterface requesterCallback;
        string property;
        uint blockNum;
        address cont;
        int128 result;
        uint startTime;
        uint endTime;
    }
    
    event NewRequest(uint64 rId);
  
    uint64 public reqId = 0;
    mapping(uint64 => Query) public reqQueue;
    uint64 private first = 0;
    uint64 private last = 0;


    uint256 public maxReqTime;
    uint64 public currReq = 0;

    OffchainAggregator public ocr;


    function checkValue(string calldata property, uint blockNum, address cont, OCRCallbackInterface callbackAddr)
    public
    returns(uint64)
    {
        require((address(callbackAddr)==address(0) || address(callbackAddr)==msg.sender), 
            "The callback contract must have the same address as the requester");

        reqId++;
        last = reqId;
        Query memory newQuery = Query(msg.sender, callbackAddr, property, blockNum, cont, 0, 0, 0);
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

    function oraclesResult(uint64 id, int128 data) 
    external
    override
    {
       uint64 _id = uint64(id);
       reqQueue[_id].result = data;
       reqQueue[_id].endTime = block.timestamp;
       currReq = 0;
       if(address(reqQueue[_id].requesterCallback)!=address(0))
            reqQueue[_id].requesterCallback.oraclesResult(id, data);
       checkNewRound();
    }


    function checkResult(uint64 id)
    external
    view
    returns(int128)
    {
        return reqQueue[id].result;
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
}
