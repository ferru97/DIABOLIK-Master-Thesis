pragma solidity ^0.7.0;

interface OCRCallbackInterface {
  function oraclesResult(uint64 id, int128 data) external;
}