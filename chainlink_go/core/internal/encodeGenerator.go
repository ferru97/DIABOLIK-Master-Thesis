package main

import (
	"fmt"
	"encoding/hex"
	"time"

	ocrtypes "github.com/smartcontractkit/libocr/offchainreporting/types"
	"github.com/ethereum/go-ethereum/common"
	"github.com/smartcontractkit/libocr/offchainreporting/confighelper"
	"golang.org/x/crypto/curve25519"

)


func main() {

	// INPUT DATA. Provide the number of oracles and for each of them the respective config_pubkey, signing_address, offchain_pubkey, transmit_address
	const  n_oracles = 10
	config_pubkey := [n_oracles]string{"44b4517945ae0e92f5a9783f1ce025036640b77877c4aaeaeda4b40318790727","d94b272a462c7e6e8eb688afdd18d615b83d5ad518be5b093c3d60e9dd9d113b","0c6e245b0c63742b5df5a9ce96b4424aee87a5a0a90db68122c46a7451d88a0b","a7a3e353e9656683d001e13f7288ad585f9fd0c3147f2f5e82e7b684f7ee8d66","6e80bff5beccbfb88831c56ebcd2792338da9f17c89836a36de9caaeff59a042","bd12d9e2af900afbdc00d3d824fa7cb637a5055855afb9eaa02ccb7a34ddf626","e908fb3420478490c14683e167c4cebfcd12f325586075b1ca125fc5da73872c","b975eaf9f6c7ee933f74ec41af696baa1cb9c153a9fb2516b8137c8fbd4fab74","de94afbf428453248798e443c2456e84cf90fcd66f21acbe6fb736ccfc4e282d","993636b9aebb04191a16b76cfaf414db41dd4f9c4613e83fee0a37e1e2047a35"}
	signing_address := [n_oracles]string{"0x3b9e47719194ccecc62e410fe5bbc82b4164d93d","0xebcdedae8fbc1e7c7150b43635b786ca05fd4cd0","0xc008ff257568383eaeadc6a601a9c35df9e0d027","0x662990260df2e3c63d99bf71032e03d3e3fe9a19","0xa9d07a55a04a2e69bdc68c818d68a46ed3ec5ee6","0xef7be5450c430c4046c3e247c653a1ff8ec545c2","0xfffc54ef37fd2461c88d8edef18ad3bbb96ab3b0","0xd09923d15fa39a4b7aa6ef469fd23edcd68c71e5","0xd7fc756366a093768b7f77a7ba98e16ab524e924","0x4d9709b1037411bc21a3f8fee7e38bee3c20c098"}
	offchain_pubkey := [n_oracles]string{"23c67cf4b3d9177855ed20f25b8a722790a597378c0925743693aa0a8e0a33b4","e83c6f2e6a3eb7b2e58e2941b914ac2f04bd7dcd0e3c55ef28e500ddea678dd9","7882dffe9446b75a4321b27de15ad6cb0d100665088a34f67618356733f371ff","986e9c5e47bf06da582da764eee651418dce12bd0b11e7b1616e791c04375117","70f5352398e7f72e0a2548b5a049414367e9e1affc00695822da36122d5d6bbc","21c1c5bedf618739d5212d3bfab16ea133f7aa6c1c1826ac0e2782c831720b23","627a98a974fc0aee826cfbf1181c6e97825f17ab1e16e46171226f5a318700a4","40492b1523d8eb92ce1d1f5320b0423480979a05874dbbab1b5ef880cee5302c","c06cbf38f172b4fc1ad59f1653198565119c2f587aa4eca53b6288b94bcdf629","282a5c6860d0e661501aac8ce0bd8d788481922c0dc9f8751b5951f9e95aac8c"}
	p2p_id := [n_oracles]string{"12D3KooWKsoRWGg88Fcr4RmefvcTQqsWrjdBKSxHd9g5ANs2MQAC","12D3KooWLcK6UTuXDSAdTtFwBk89wrSQx9rCy1SqiiHzkQoXfv7m","12D3KooWRef2vU6aoHaGZrTpqaBGoPDvzRkej77CafnbJ8Baggcy","12D3KooWGwmoGSZos32iFZ1vXUhuVQs9n3RkRjgcjgDKtwtzFWfM","12D3KooWSfoECFGH3AiJHVKA3Lx48QjPMbbATskQZiQd2ktktjnC","12D3KooWKnaSYKZW82bdLjWnHD4ZEeL34xsNtDrfjTTKv3DCXsXf","12D3KooWAZFxEAXegQfexp2VrN1BjuvxW8TdaLg6soDUBceJDR53","12D3KooWPkrvvwV8tW2vLypyaQrgAiDiE9YcK5GXE4yUXhuwKVe8","12D3KooWJroJEoznskkFpdvRGNpxRCMcuqm5TFKJMV6PrsEiCTvt","12D3KooW9yR7owLpJ2gvEUad7GGGaBje7vz3qFbyJgUiQLPwS5au"}
	transmit_address := [n_oracles]string{"0x838aCD0f3Fbf6C5F4d994A6870a2a28afaC63F98","0x7E836AF68696ACe5509dC3B218081befcD6114B4","0x0041eB4b6818CECB501c5520f20e93163CC7F2b7","0x17b64dcE4ad70Ad4B69917Ba1C8E2448d891e5dF","0x3aAac0F7ebC192115BFb4521835044C78aeCEf83","0xC4A6e31e41b7b7AA23A548bf991969761ceDf2Ae","0xAA3DD3dB7AD59010e86307B257Feef3f10561a24","0x37919aFB5D7Db5754DB9e4af39Ace4C3eFD524bf","0x150359818f0B2a0B3b0DBE0805131BD1FF49C9e9","0xfF922a6e5096269dF42E05e2590Bd52C905ce88e"}
	
	var(
		oracles  []confighelper.OracleIdentityExtra
	)
	

	const  test_oracles = 4
	for i := 0; i < test_oracles; i++ {
		x, _ := hex.DecodeString(config_pubkey[i])
		var k_config [curve25519.PointSize]byte
		copy(k_config[:], x)

		offchain_pubkey_bytes, _ := hex.DecodeString(offchain_pubkey[i])

		oracles = append(oracles, confighelper.OracleIdentityExtra{
			OracleIdentity: confighelper.OracleIdentity{
				OnChainSigningAddress: ocrtypes.OnChainSigningAddress(common.HexToAddress(signing_address[i])),
				TransmitAddress:       common.HexToAddress(transmit_address[i]),
				OffchainPublicKey:     ocrtypes.OffchainPublicKey(offchain_pubkey_bytes),
				PeerID:                p2p_id[i],
			},
			SharedSecretEncryptionPublicKey: k_config,
		})
	}

	var one_second int 
	one_second = 1000000000
	s := []int{1,1,1,1}
	// OCR configuration parameters. Change them as you prefere
	// You must ensure thet deltaGrace < deltaRound  and  deltaRound < deltaProgress
	_, _, _, _, encodedConfig, _ := confighelper.ContractSetConfigArgs(
		time.Duration(30 * one_second), //ns deltaProgress If this does not produce a valid report after ∆progress units of time, the oracle 
				 						//initiates a switch to the next epoch, and the corresponding next leader.
		time.Duration(20 * one_second), //ns deltaResend The node broadcasts a NEWEPOCH message containing ne every ∆resend seconds 
		time.Duration(20 * one_second), //ns deltaRound Leader start a new round is started every ∆round units of time.
		time.Duration(2 * one_second),  //ns deltaGrace extra delay time after the leader receives 2f+1 OBSERVE messages
		time.Duration(9223372036854775807),  //ns deltaC limits how often updates are transmitted to the contract as long as the median isn’t changing by more then α.
		1, // α allows larger changes of the median to be reported immediately, bypassing ∆C
		time.Duration(10 * one_second), //ns deltaStage stage duration
		5,		  			//RMax max number of stages a leader can initiate
		s,//transmitDelays?? how many round the oracle must wait before its next transmission??	
		oracles,
		test_oracles/3, //f
	)


    outputHex := hex.EncodeToString(encodedConfig)
	fmt.Print(outputHex)

	
}