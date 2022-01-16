const manager = artifacts.require('RequestManager')
const ocr = artifacts.require("OffchainAggregator")
const ac = artifacts.require("AccessController")
const betDapp = artifacts.require('Gambling')
const Operator = artifacts.require('Operator')
const DepositLimitation = artifacts.require('DepositLimitation')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')

//275046176355070374110092839585164817690
const OPERATOR_JOB = "0x142ff8885ecb4152a44969de0b419e9e00000000000000000000000000000000"
const DATA_FETCH_COST = "1000000000000000000"
const LINK_ADDRESS = "0xf8066f5Daf76f4292d0b749E2d856228459AeDc4"
const ONE_LINK = "1000000000000000000"
const betDapps = ["0x08b32799ABCECE7709A53D87F8abb08BeCC38200","0x69287eC30F7477b3D07154cc3F7E1d8D5353dFa2","0x3B1D3b3a3127cFfC0025cc194f0BfF88fCcBa400"]

const transmit_address = ["0x838aCD0f3Fbf6C5F4d994A6870a2a28afaC63F98","0x7E836AF68696ACe5509dC3B218081befcD6114B4","0x0041eB4b6818CECB501c5520f20e93163CC7F2b7","0x17b64dcE4ad70Ad4B69917Ba1C8E2448d891e5dF","0x3aAac0F7ebC192115BFb4521835044C78aeCEf83","0xC4A6e31e41b7b7AA23A548bf991969761ceDf2Ae","0xAA3DD3dB7AD59010e86307B257Feef3f10561a24","0x37919aFB5D7Db5754DB9e4af39Ace4C3eFD524bf","0x150359818f0B2a0B3b0DBE0805131BD1FF49C9e9","0xfF922a6e5096269dF42E05e2590Bd52C905ce88e"]
const signing_address = ["0x3b9e47719194ccecc62e410fe5bbc82b4164d93d","0xebcdedae8fbc1e7c7150b43635b786ca05fd4cd0","0xc008ff257568383eaeadc6a601a9c35df9e0d027","0x662990260df2e3c63d99bf71032e03d3e3fe9a19","0xa9d07a55a04a2e69bdc68c818d68a46ed3ec5ee6","0xef7be5450c430c4046c3e247c653a1ff8ec545c2","0xfffc54ef37fd2461c88d8edef18ad3bbb96ab3b0","0xd09923d15fa39a4b7aa6ef469fd23edcd68c71e5","0xd7fc756366a093768b7f77a7ba98e16ab524e924","0x4d9709b1037411bc21a3f8fee7e38bee3c20c098"]
const threshold = 1
const encVersion = 1
const encoded = "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000006fc23ac0000000000000000000000000000000000000000000000000000000004a817c80000000000000000000000000000000000000000000000000000000004a817c80000000000000000000000000000000000000000000000000000000000773594000000000000000000000000000000000000000000000000007fffffffffffffff000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000002540be400000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000005c000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000a23c67cf4b3d9177855ed20f25b8a722790a597378c0925743693aa0a8e0a33b4e83c6f2e6a3eb7b2e58e2941b914ac2f04bd7dcd0e3c55ef28e500ddea678dd97882dffe9446b75a4321b27de15ad6cb0d100665088a34f67618356733f371ff986e9c5e47bf06da582da764eee651418dce12bd0b11e7b1616e791c0437511770f5352398e7f72e0a2548b5a049414367e9e1affc00695822da36122d5d6bbc21c1c5bedf618739d5212d3bfab16ea133f7aa6c1c1826ac0e2782c831720b23627a98a974fc0aee826cfbf1181c6e97825f17ab1e16e46171226f5a318700a440492b1523d8eb92ce1d1f5320b0423480979a05874dbbab1b5ef880cee5302cc06cbf38f172b4fc1ad59f1653198565119c2f587aa4eca53b6288b94bcdf629282a5c6860d0e661501aac8ce0bd8d788481922c0dc9f8751b5951f9e95aac8c0000000000000000000000000000000000000000000000000000000000000211313244334b6f6f574b736f52574767383846637234526d656676635451717357726a64424b53784864396735414e73324d5141432c313244334b6f6f574c634b36555475584453416454744677426b38397772535178397243793153716969487a6b516f586676376d2c313244334b6f6f5752656632765536616f4861475a725470716142476f5044767a526b656a37374361666e624a384261676763792c313244334b6f6f5747776d6f47535a6f73333269465a317658556875565173396e33526b526a67636a67444b7477747a4657664d2c313244334b6f6f5753666f45434647483341694a48564b41334c783438516a504d62624154736b515a695164326b746b746a6e432c313244334b6f6f574b6e6153594b5a57383262644c6a576e4844345a45654c333478734e744472666a54544b76334443587358662c313244334b6f6f57415a4678454158656751666578703256724e31426a75767857385464614c6736736f44554263654a445235332c313244334b6f6f57506b727676775638745732764c7970796151726741694469453959634b35475845347955586875774b5665382c313244334b6f6f574a726f4a456f7a6e736b6b4670647652474e707852434d6375716d3554464b4a4d56365072734569435476742c313244334b6f6f57397952376f774c704a326776455561643747474761426a6537767a33714662794a675569514c5077533561750000000000000000000000000000005cb6f9076122dcf7abb331ab8d696751ee00f6e8946f12cd4eeb8a97cfbcec469e0483253e34893eb0c4b5fbf19000ab4a77d648c5d0a04bf8a38d7116cd307f0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000ac576464d4a6a184368e1817c7c5367450000000000000000000000000000000090afa657a74aa32f0c966e134316599500000000000000000000000000000000ef62f8c218bf02509b9cc067c9c5e82e000000000000000000000000000000007302c9aaa183cd8ca3ca6aaf49c3883700000000000000000000000000000000a5af67a96ee027e5d5e41ecbe17087ac00000000000000000000000000000000676667f690d13ba17e27bf61e86e85b90000000000000000000000000000000087144ebfeae9fc13f96584dabf35c7fe000000000000000000000000000000003cc7dd46b38da5b5f778979e296b69b80000000000000000000000000000000069fb1f87a7fb7fdeabb836ab90cf23380000000000000000000000000000000054524e06fb88010513daf94b645af6e400000000000000000000000000000000"
const maxReqTime = 120
const LINKperWei = 190

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
    manager.setProvider(deployer.provider)
    ocr.setProvider(deployer.provider)
    ac.setProvider(deployer.provider)
    betDapp.setProvider(deployer.provider)
    LinkToken.setProvider(deployer.provider)
    Operator.setProvider(deployer.provider)
    DepositLimitation.setProvider(deployer.provider)

    var link_cnt = await LinkToken.at(LINK_ADDRESS)

    var dr_dep = await deployer.deploy(Operator, LINK_ADDRESS, defaultAccount, { from: defaultAccount })
    var operator_cnt = await Operator.deployed()
    var fun1 = await operator_cnt.setAuthorizedSenders(transmit_address ,{from: defaultAccount})

    var reqmanager_dep = await deployer.deploy(manager, DATA_FETCH_COST, operator_cnt.address, OPERATOR_JOB, LINK_ADDRESS,  { from: defaultAccount })
    var manager_cnt = await manager.deployed()
    
    await deployer.deploy(ac, { from: defaultAccount })
    var ac_cnt = await ac.deployed()

    var fun2 = await ac_cnt.addAccess(manager_cnt.address, { from: defaultAccount })
    var fun3 = await ac_cnt.addAccess(defaultAccount, { from: defaultAccount })

    var deposit_dep = await deployer.deploy(DepositLimitation, { from: defaultAccount })
    var depositLimitation_cnt = await DepositLimitation.deployed()
    var fun4 = await depositLimitation_cnt.setGamblingDapps(betDapps, { from: defaultAccount })

    var gambling_dep = await deployer.deploy(betDapp, manager_cnt.address, LINKperWei, LINK_ADDRESS, depositLimitation_cnt.address, { from: defaultAccount, value: 1000 })
    var betDapp_cnt = await betDapp.deployed()

    var ocr_dep = await deployer.deploy(ocr, ocr_conf["maximumGasPrice"],ocr_conf["reasonableGasPrice"],ocr_conf["microLinkPerEth"],
    ocr_conf["linkGweiPerObservation"],ocr_conf["linkGweiPerTransmission"],LINK_ADDRESS,ocr_conf["minAnswer"],
    ocr_conf["maxAnswer"],ac_cnt.address,ac_cnt.address,ocr_conf["decimals"],ocr_conf["description"], { from: defaultAccount })
    var ocr_cnt = await ocr.deployed()

    var fun5 = await ocr_cnt.setMaxrequestLinkTonken("15500000000000000000", { from: defaultAccount })
    var fun6 = await ocr_cnt.setPayees(transmit_address,transmit_address, { from: defaultAccount })
    var fun7 = await ocr_cnt.setConfig(signing_address,transmit_address,threshold,encVersion,encoded, { from: defaultAccount })
    var fun8 = await ocr_cnt.setRequestManager(manager_cnt.address, { from: defaultAccount })
    await depositLimitation_cnt.setMonthlySelfLimitation("10000000000000", { from: defaultAccount })


    var fun9 = await manager_cnt.setOCRcontract(ocr_cnt.address, { from: defaultAccount })
    var fun10 = await manager_cnt.setMaxReqTime(maxReqTime, { from: defaultAccount })
    var fun11 = await betDapp_cnt.approveLink("150000000000000000000", { from: defaultAccount })
    const link20 = BigInt(ONE_LINK)*BigInt(100) 
    await link_cnt.transfer(betDapp_cnt.address, link20.toString(), { from: defaultAccount })

    console.log("DepositLimitation: ",depositLimitation_cnt.address)
    console.log("Gambling         : ",betDapp_cnt.address)
    console.log("ReqManger        : ",manager_cnt.address)
    console.log("OCR              : ",ocr_cnt.address)
    console.log("DR address:      : ",operator_cnt.address)

    var reqManager_gas = parseInt((await web3.eth.getTransactionReceipt(reqmanager_dep.transactionHash)).gasUsed) + fun9.receipt.gasUsed + fun10.receipt.gasUsed
    var depositLimitation_gas = parseInt((await web3.eth.getTransactionReceipt(deposit_dep.transactionHash)).gasUsed) + fun4.receipt.gasUsed
    var gambling_gas = parseInt((await web3.eth.getTransactionReceipt(gambling_dep.transactionHash)).gasUsed) + fun11.receipt.gasUsed
    var dr_gas = parseInt((await web3.eth.getTransactionReceipt(dr_dep.transactionHash)).gasUsed) + fun1.receipt.gasUsed
    var ocr_gas = parseInt((await web3.eth.getTransactionReceipt(ocr_dep.transactionHash)).gasUsed) + fun5.receipt.gasUsed + fun6.receipt.gasUsed + fun7.receipt.gasUsed + fun8.receipt.gasUsed
    
    console.log("---------GAS ESTIMATION---------")
    console.log("DepositLimitation: ",depositLimitation_gas)
    console.log("Gambling         : ",gambling_gas)
    console.log("ReqManger        : ",reqManager_gas)
    console.log("OCR              : ",ocr_gas)
    console.log("DR address:      : ",dr_gas)

  } catch (err) {
    console.error(err)
  }
}
