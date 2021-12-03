pragma solidity ^0.7.0;

interface OCRCallbackInterface {
  function oraclesResult(uint64 id, uint128 data) external;
}