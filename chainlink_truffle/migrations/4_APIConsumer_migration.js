const APIConsumer = artifacts.require('APIConsumer')

const ORACLE = "0xdd7B5EBf055bE20F08D64b64f24e988AC5d9c585"
const JOBID = "a22ee79a54d24927bb3a1ad0d09de40e"
const LINK = "0xb879A3417473aC9ECC54A703Af5bb56bEb2C065D"

module.exports = async (deployer, network, [defaultAccount]) => {
  try {
    APIConsumer.setProvider(deployer.provider)
    
    await deployer.deploy(APIConsumer, LINK, ORACLE, JOBID, { from: defaultAccount })
  } catch (err) {
    console.error(err)
  }
}
