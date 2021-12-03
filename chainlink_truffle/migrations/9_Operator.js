const Operator = artifacts.require('Operator')

const LINK_ADDRESS = "0xf8066f5Daf76f4292d0b749E2d856228459AeDc4"

module.exports = async (deployer, network, [defaultAccount]) => {
  try {
    Operator.setProvider(deployer.provider)
    await deployer.deploy(Operator, LINK_ADDRESS, defaultAccount, { from: defaultAccount })
  } catch (err) {
    console.error(err)
  }
}
