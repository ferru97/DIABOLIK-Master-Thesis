const tracker = artifacts.require('ValuesTracker')
const ocr = artifacts.require("OffchainAggregator")
const ac = artifacts.require("AccessController")
const values = artifacts.require('Values')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')


const LINK_ADDRESS = "0x60ff4fF8888b4F3df5220Bbe78e1b310b2A2ebea"
const ONE_LINK = "1000000000000000000"

const transmit_address = ["0x4cD73f70fd4f0Cbf61F18132B429742cE3798f9e","0x0C422c6266A356961d97f19C997FF54492308959","0xaCeadFb4b07c035e865Cc342B45f983C2D12B6f5","0xa12A7068c1b61F9BF26b2957E28F080D9d2e590e"]
const signing_address = ["0xcbf2d08e3d869fff245d201db6949a4ae20333e7","0x2f504fbfd991a2c786da7cfee87aa5c0dc8d8611","0xcc8279dc3dfccb9ce71242f34d7df45b40b35acb","0xa363d4ce1f32fa17fbf8d9eb19b445dd3d957c97"]
const threshold = 1
const encVersion = 1
const encoded = "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000006fc23ac0000000000000000000000000000000000000000000000000000000004a817c80000000000000000000000000000000000000000000000000000000004a817c80000000000000000000000000000000000000000000000000000000000773594000000000000000000000000000000000000000000000000007fffffffffffffff000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000002540be40000000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000003c0000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004a3e711b9a399a4b9792e9e79acde05bc39d578dc1c03d4e6b5e62d6cb5fcaffaf027ff10e64848df9b376eddac2cafdd7e00477de8c310308f78e63691cc485e08fcbbdf7ca2df0c3d012ebe85b5362640fe4d7c9c027ecb209f8e05bcf27ac34b8e7048fa8defbc241a8ae4f224a5de704e02504cf6e59207d8c344b01810bb00000000000000000000000000000000000000000000000000000000000000d3313244334b6f6f574270384c3150677334526b70355932656d707968366770376a45766839545879414d36657863754b65466e362c313244334b6f6f574e747946577472396469414452724e714e5564347a4145786d4e626e6e444d7a79783764524b6a414d3163522c313244334b6f6f574d6f677257645a37654238796e6b774c7555614a4445536242734e744871725664565377567846566e4a75672c313244334b6f6f57504558647652327a384a46733575735563397447674a7572726d53516559437057554762427133534775544800000000000000000000000000e6fcdb419640c3236c05a2377b62ab5c470ba3e2e0e566ee0e1abe9e3e94596ed36ff9edaa6e1534625fbc03a0619cd4a0827542d82fdefcabdda80e24f96d8f000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000043bd4a4460e44e7f456a1773941c1660400000000000000000000000000000000595a4f8a9980393bb2a9a78d7bf7075f000000000000000000000000000000009346493d7706d3f0970e34e67eb2823900000000000000000000000000000000eb0209293b594311aaf439ae406d4ce100000000000000000000000000000000"
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

    await deployer.deploy(tracker, { from: defaultAccount })
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
