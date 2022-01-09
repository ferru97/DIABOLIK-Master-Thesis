pragma solidity ^0.7.0;

interface OCRCallbackInterface {
  function hashCallback(uint64 id, uint128 data, uint256 linkRefunded) external;
}