pragma solidity ^0.7.1;
import "./centralized-oracle-lib/ChainlinkClient.sol";

contract ValuesFetcher is ChainlinkClient {

    using Chainlink for Chainlink.Request;
  
    bytes public _answer;
    address public _sender;
    address public oracle;
    bytes32 public jobId;
    uint256 public fee;
    
    constructor(address _oracle, bytes32 _jobID, address _link) public {
    //    setPublicChainlinkToken();
    //Fill in the Oracle address we just deployed
    //    oracle = _oracle;
    //Fill in the address we just created
        oracle = _oracle;
        setChainlinkToken(_link);
        setChainlinkOracle(_oracle);
        jobId = _jobID;
    //The minimum fee paid to Oracle can be found in the configuration page minimum_ CONTRACT_ View the payment field
        fee = 1 * 10 ** 18; // 1 LINK
    }

    function doRequest(uint256 _payment, string memory val) public {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill2.selector);
        req.add("number", val);
        sendChainlinkRequest(req, _payment);
    }

    function fulfill2(bytes32 requestID, bytes calldata answer, address sender) public {
        _answer = answer;
        _sender = sender;
    }

    function setJobID(bytes32 _jobID) public{
        jobId = _jobID;
    }


}