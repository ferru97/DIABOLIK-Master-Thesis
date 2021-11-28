const valuesTracker = artifacts.require('ValuesTracker')

module.exports = async (deployer, network, [defaultAccount]) => {
  try {
    valuesTracker.setProvider(deployer.provider)
    await deployer.deploy(valuesTracker, { from: defaultAccount })
  } catch (err) {
    console.error(err)
  }
}
