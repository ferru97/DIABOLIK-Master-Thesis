const Oracle = artifacts.require('Oracle')
const LINK = "0xb879A3417473aC9ECC54A703Af5bb56bEb2C065D"

module.exports = async (deployer, network, [defaultAccount]) => {
  try {
    Oracle.setProvider(deployer.provider)
    await deployer.deploy(Oracle, LINK, { from: defaultAccount })
  } catch (err) {
    console.error(err)
  }
}
