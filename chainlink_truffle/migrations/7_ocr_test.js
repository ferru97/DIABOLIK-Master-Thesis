const tracker = artifacts.require('ValuesTracker')
const ocr = artifacts.require("OffchainAggregator")
const ac = artifacts.require("AccessController")
const values = artifacts.require('Values')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')

//275046176355070374110092839585164817690
const OPERATOR = "0xF98Cb0fee362a45EbA64756a804BD77b4bB8800E"
const OPERATOR_JOB = "0x142ff8885ecb4152a44969de0b419e9e00000000000000000000000000000000"
const DATA_FETCH_COST = "100000000000000000"
const LINK_ADDRESS = "0xf8066f5Daf76f4292d0b749E2d856228459AeDc4"
const ONE_LINK = "1000000000000000000"

const transmit_address = ["0x838aCD0f3Fbf6C5F4d994A6870a2a28afaC63F98","0x7E836AF68696ACe5509dC3B218081befcD6114B4","0x0041eB4b6818CECB501c5520f20e93163CC7F2b7","0x17b64dcE4ad70Ad4B69917Ba1C8E2448d891e5dF","0x3aAac0F7ebC192115BFb4521835044C78aeCEf83","0xC4A6e31e41b7b7AA23A548bf991969761ceDf2Ae","0xAA3DD3dB7AD59010e86307B257Feef3f10561a24","0x37919aFB5D7Db5754DB9e4af39Ace4C3eFD524bf","0x150359818f0B2a0B3b0DBE0805131BD1FF49C9e9","0xfF922a6e5096269dF42E05e2590Bd52C905ce88e"]
const signing_address = ["0x3b9e47719194ccecc62e410fe5bbc82b4164d93d","0xebcdedae8fbc1e7c7150b43635b786ca05fd4cd0","0xc008ff257568383eaeadc6a601a9c35df9e0d027","0x662990260df2e3c63d99bf71032e03d3e3fe9a19","0xa9d07a55a04a2e69bdc68c818d68a46ed3ec5ee6","0xef7be5450c430c4046c3e247c653a1ff8ec545c2","0xfffc54ef37fd2461c88d8edef18ad3bbb96ab3b0","0xd09923d15fa39a4b7aa6ef469fd23edcd68c71e5","0xd7fc756366a093768b7f77a7ba98e16ab524e924","0x4d9709b1037411bc21a3f8fee7e38bee3c20c098"]
const threshold = 1
const encVersion = 1
const encoded = "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000006fc23ac0000000000000000000000000000000000000000000000000000000004a817c80000000000000000000000000000000000000000000000000000000004a817c80000000000000000000000000000000000000000000000000000000000773594000000000000000000000000000000000000000000000000007fffffffffffffff000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000002540be40000000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000003c000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000423c67cf4b3d9177855ed20f25b8a722790a597378c0925743693aa0a8e0a33b4e83c6f2e6a3eb7b2e58e2941b914ac2f04bd7dcd0e3c55ef28e500ddea678dd97882dffe9446b75a4321b27de15ad6cb0d100665088a34f67618356733f371ff986e9c5e47bf06da582da764eee651418dce12bd0b11e7b1616e791c0437511700000000000000000000000000000000000000000000000000000000000000d3313244334b6f6f574b736f52574767383846637234526d656676635451717357726a64424b53784864396735414e73324d5141432c313244334b6f6f574c634b36555475584453416454744677426b38397772535178397243793153716969487a6b516f586676376d2c313244334b6f6f5752656632765536616f4861475a725470716142476f5044767a526b656a37374361666e624a384261676763792c313244334b6f6f5747776d6f47535a6f73333269465a317658556875565173396e33526b526a67636a67444b7477747a4657664d000000000000000000000000009ccc0ef7965d8ae83db60bbb739451031d26b6bde80b7206e012778e582430116abd4679c73f5cd3796a878d5a0428dd9594c0673ef18bfdfc94176ddc357f15000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000046ab5eb142255594cce6247c75cba2233000000000000000000000000000000000e6109610deef1b9a5938e6eb54ec862000000000000000000000000000000008026c95ae379007e1212074b33d3487800000000000000000000000000000000ea3b7400510bef81218b3a479924972c00000000000000000000000000000000"
const maxReqTime = 120

const ocr_conf = {
  "decimals": 5,
  "maximumGasPrice": 3000,
  "reasonableGasPrice": 100,
  "microLinkPerEth": 1,//128900000,
  "linkGweiPerObservation": 2000000000,
  "linkGweiPerTransmission": 100000000,
  "minAnswer": 0,
  "maxAnswer": 10,
  "description": "OCR test"

}

module.exports = async (deployer, network, [defaultAccount]) => {
  console.log(network)
  try {
    tracker.setProvider(deployer.provider)
    ocr.setProvider(deployer.provider)
    ac.setProvider(deployer.provider)
    values.setProvider(deployer.provider)
    LinkToken.setProvider(deployer.provider)

    let link = await LinkToken.at(LINK_ADDRESS);

    await deployer.deploy(values, { from: defaultAccount })
    var values_cnt = await values.deployed()
    await values_cnt.setA(18)
    var block = await web3.eth.getBlock("latest")

    await deployer.deploy(tracker, DATA_FETCH_COST, OPERATOR, OPERATOR_JOB, LINK_ADDRESS,  { from: defaultAccount })
    await deployer.deploy(ac, { from: defaultAccount })
 
    var tracker_cnt = await tracker.deployed()
    var ac_cnt = await  ac.deployed()

    await ac_cnt.addAccess(tracker_cnt.address, { from: defaultAccount })
    await ac_cnt.addAccess(defaultAccount, { from: defaultAccount })

    await deployer.deploy(ocr, ocr_conf["maximumGasPrice"],ocr_conf["reasonableGasPrice"],ocr_conf["microLinkPerEth"],
    ocr_conf["linkGweiPerObservation"],ocr_conf["linkGweiPerTransmission"],LINK_ADDRESS,ocr_conf["minAnswer"],
    ocr_conf["maxAnswer"],ac_cnt.address,ac_cnt.address,ocr_conf["decimals"],ocr_conf["description"], { from: defaultAccount })
    var ocr_cnt = await ocr.deployed()

    await ocr_cnt.setMaxrequestLinkTonken("15000000000000000000", { from: defaultAccount })
    await ocr_cnt.setPayees(transmit_address,transmit_address, { from: defaultAccount })
    await ocr_cnt.setConfig(signing_address,transmit_address,threshold,encVersion,encoded, { from: defaultAccount })
    await ocr_cnt.setValueTracker(tracker_cnt.address, { from: defaultAccount })
    await tracker_cnt.setOCR(ocr_cnt.address, { from: defaultAccount })
    await tracker_cnt.setMaxReqTime(maxReqTime, { from: defaultAccount })
    //await tracker_cnt.checkValue("a",block.number,values_cnt.address)
    await link.approve(ocr_cnt.address, "150000000000000000000", { from: defaultAccount })
    await link.approve(tracker_cnt.address, "150000000000000000000", { from: defaultAccount })


    console.log("values address : ",values_cnt.address)
    console.log("AC address     : ",ac_cnt.address)
    console.log("Tracker address: ",tracker_cnt.address)
    console.log("OCR address    : ",ocr_cnt.address)

  } catch (err) {
    console.error(err)
  }
}
