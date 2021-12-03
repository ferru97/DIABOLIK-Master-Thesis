const tracker = artifacts.require('ValuesTracker')
const ocr = artifacts.require("OffchainAggregator")
const ac = artifacts.require("AccessController")
const values = artifacts.require('Values')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')


const OPERATOR = "0x9d64859D3C290AC6B4AD34B2BfF9Fc58673b7b8B"
const OPERATOR_JOB = "0x142ff8885ecb4152a44969de0b419e9e00000000000000000000000000000000"
const DATA_FETCH_COST = "100000000000000000"
const LINK_ADDRESS = "0xf8066f5Daf76f4292d0b749E2d856228459AeDc4"
const ONE_LINK = "1000000000000000000"

const transmit_address = ["0x3E1Ba9bAEDbeA85F4B3ff795519A14c8D4A1b538","0x7E836AF68696ACe5509dC3B218081befcD6114B4","0x0041eB4b6818CECB501c5520f20e93163CC7F2b7","0x17b64dcE4ad70Ad4B69917Ba1C8E2448d891e5dF"]
const signing_address = ["0x9160ec95ac66db7adccf2cb47e1f52c2ad329e97","0xebcdedae8fbc1e7c7150b43635b786ca05fd4cd0","0xc008ff257568383eaeadc6a601a9c35df9e0d027","0x662990260df2e3c63d99bf71032e03d3e3fe9a19"]
const threshold = 1
const encVersion = 1
const encoded = "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000006fc23ac0000000000000000000000000000000000000000000000000000000004a817c80000000000000000000000000000000000000000000000000000000004a817c80000000000000000000000000000000000000000000000000000000000773594000000000000000000000000000000000000000000000000007fffffffffffffff000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000002540be40000000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000003c0000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004234395d4fdd98987ade3e05034301ab3bbda5ac0ebcf84361c4b2f299e265e2ee83c6f2e6a3eb7b2e58e2941b914ac2f04bd7dcd0e3c55ef28e500ddea678dd97882dffe9446b75a4321b27de15ad6cb0d100665088a34f67618356733f371ff986e9c5e47bf06da582da764eee651418dce12bd0b11e7b1616e791c0437511700000000000000000000000000000000000000000000000000000000000000d3313244334b6f6f574b7869367448574b526258506b506f31744350516e79786a7a37637244695a4d685146466a75534b724333642c313244334b6f6f574c634b36555475584453416454744677426b38397772535178397243793153716969487a6b516f586676376d2c313244334b6f6f5752656632765536616f4861475a725470716142476f5044767a526b656a37374361666e624a384261676763792c313244334b6f6f5747776d6f47535a6f73333269465a317658556875565173396e33526b526a67636a67444b7477747a4657664d000000000000000000000000005f2345b0c4c5f6c2e908c43dc291dc992180c6a7cac5f9cf8fbb7bb2643cce3af68379b3c4c6d99b41f1f93b1674b332c798e88e2c77b147f39a7960ee5df84b0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000422a9c1266fa00876352592f855acf1340000000000000000000000000000000017904d91ee137d397527f30391f6840e000000000000000000000000000000006969101b7066d2710ed2d48e9b2439b7000000000000000000000000000000002f35d2ed19cb42fd6dac8650fd4dfd6700000000000000000000000000000000"
const maxReqTime = 300

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


    console.log("values address : ",values_cnt.address)
    console.log("AC address     : ",ac_cnt.address)
    console.log("Tracker address: ",tracker_cnt.address)
    console.log("OCR address    : ",ocr_cnt.address)

  } catch (err) {
    console.error(err)
  }
}
