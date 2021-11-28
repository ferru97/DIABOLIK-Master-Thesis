const values = artifacts.require('Values')

module.exports = async (deployer, network, [defaultAccount]) => {
  try {
    values.setProvider(deployer.provider)
    await deployer.deploy(values, { from: defaultAccount })
  } catch (err) {
    console.error(err)
  }
}
