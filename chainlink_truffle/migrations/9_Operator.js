const Operator = artifacts.require('Operator')

const LINK_ADDRESS = "0xf8066f5Daf76f4292d0b749E2d856228459AeDc4"
const transmit_address = ["0x3E1Ba9bAEDbeA85F4B3ff795519A14c8D4A1b538","0x7E836AF68696ACe5509dC3B218081befcD6114B4","0x0041eB4b6818CECB501c5520f20e93163CC7F2b7","0x17b64dcE4ad70Ad4B69917Ba1C8E2448d891e5dF"]

module.exports = async (deployer, network, [defaultAccount]) => {
  try {
    Operator.setProvider(deployer.provider)
    await deployer.deploy(Operator, LINK_ADDRESS, defaultAccount, { from: defaultAccount })
    var operator_cnt = await Operator.deployed()
    await operator_cnt.setAuthorizedSenders(transmit_address ,{from: defaultAccount})
  } catch (err) {
    console.error(err)
  }
}
