package main

import (
	"fmt"
	"encoding/hex"
	"time"
	//"crypto/ed25519"

	ocrtypes "github.com/smartcontractkit/libocr/offchainreporting/types"
	"github.com/ethereum/go-ethereum/common"
	"github.com/smartcontractkit/libocr/offchainreporting/confighelper"
	"golang.org/x/crypto/curve25519"

)


func main() {

	//keyb_id := [4]string{"0d3971bec903bad87fcc52b408cd776c7ccc30b90081a7bd5779a889c4585844","d9757a507fa2db035226e0bf2187e071104da89b35507786b4e57a6a85bb7a82","af74850033e97d138095836a8a526fc1e47d8749e27d929cf06e1c30ee59e290","7cba81590c33d061507551abf9e7debd557d9125231d3464ba2ab7a98be17e5f"}
	config_pubkey := [4]string{"7fd119d01dbb9829e69cec0ce6617aca0cc2a2f50e63a83d1e668e45c4e6a809","2b6c2e9e48634feeed963b6c4010ca03fa2bc653190bf069871e6b35525cd403","c348abd17e8c39792abb41127929cbb8b9bb8ff16b75d8572959ca19a7636f54","545879dd98912ca694985de7cd78a4eef7084b0e1e5344fb238056b4bce91d1b"}
	signing_address := [4]string{"0xcbf2d08e3d869fff245d201db6949a4ae20333e7","0x2f504fbfd991a2c786da7cfee87aa5c0dc8d8611","0xcc8279dc3dfccb9ce71242f34d7df45b40b35acb","0xa363d4ce1f32fa17fbf8d9eb19b445dd3d957c97"}
	offchain_pubkey := [4]string{"a3e711b9a399a4b9792e9e79acde05bc39d578dc1c03d4e6b5e62d6cb5fcaffa","f027ff10e64848df9b376eddac2cafdd7e00477de8c310308f78e63691cc485e","08fcbbdf7ca2df0c3d012ebe85b5362640fe4d7c9c027ecb209f8e05bcf27ac3","4b8e7048fa8defbc241a8ae4f224a5de704e02504cf6e59207d8c344b01810bb"}
	p2p_id := [4]string{"12D3KooWBp8L1Pgs4Rkp5Y2empyh6gp7jEvh9TXyAM6excuKeFn6","12D3KooWNtyFWtr9diADRrNqNUd4zAExmNbnnDMzyx7dRKjAM1cR","12D3KooWMogrWdZ7eB8ynkwLuUaJDESbBsNtHqrVdVSwVxFVnJug","12D3KooWPEXdvR2z8JFs5usUc9tGgJurrmSQeYCpWUGbBq3SGuTH"}
	transmit_address := [4]string{"0x4cD73f70fd4f0Cbf61F18132B429742cE3798f9e","0x0C422c6266A356961d97f19C997FF54492308959","0xaCeadFb4b07c035e865Cc342B45f983C2D12B6f5","0xa12A7068c1b61F9BF26b2957E28F080D9d2e590e"}
	
	var(
		oracles  []confighelper.OracleIdentityExtra
	)
	

	for i := 0; i < 4; i++ {
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
		1, //f
	)//grace < round   -- round < process


	//encodedConfig = []byte{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,119,53,148,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,59,154,202,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,59,154,202,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,29,205,101,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,152,150,128,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,119,53,148,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,128,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,192,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,192,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,55,48,101,52,48,48,52,53,50,57,57,57,100,99,101,57,49,97,53,51,102,97,53,101,50,50,52,100,99,50,57,99,100,56,97,57,55,56,97,48,100,54,50,101,53,56,97,53,48,99,97,49,55,100,97,48,55,57,53,49,57,49,52,56,51,97,102,54,97,98,53,97,102,51,55,98,102,48,57,54,54,99,100,51,50,101,99,100,55,100,57,54,48,55,52,52,230,2,118,212,247,97,114,117,90,134,85,218,203,93,54,187,217,115,195,158,1,93,137,64,101,167,115,230,252,176,138,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,211,49,50,68,51,75,111,111,87,77,98,67,118,67,105,118,57,75,98,111,118,85,112,90,66,113,101,118,109,86,99,102,112,67,111,90,51,69,75,74,110,80,122,75,89,106,88,100,103,75,116,105,98,44,49,50,68,51,75,111,111,87,82,113,86,103,113,104,75,52,87,106,113,84,101,106,89,83,111,117,81,90,103,90,76,113,87,87,105,84,75,72,89,85,51,89,65,90,67,103,107,116,112,88,112,87,44,49,50,68,51,75,111,111,87,83,56,116,99,99,56,55,105,105,122,88,116,112,106,69,100,118,120,100,103,116,53,121,100,69,74,103,99,116,98,77,111,74,74,56,77,68,102,74,70,67,66,57,71,44,49,50,68,51,75,111,111,87,77,82,80,114,109,86,57,83,118,87,74,88,97,50,110,122,107,103,121,52,49,82,101,115,112,107,113,54,101,50,66,87,52,101,119,51,118,80,116,65,106,100,76,54,0,0,0,0,0,0,0,0,0,0,0,0,0,205,217,179,182,131,212,25,64,60,132,23,250,131,175,202,166,100,86,174,51,69,174,35,241,46,176,253,82,131,254,160,37,26,27,247,83,194,80,93,171,82,4,178,132,241,254,253,125,196,235,131,246,48,70,100,201,194,244,60,191,66,86,102,96,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,63,96,76,81,5,150,53,0,184,247,58,49,194,228,101,45,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,187,251,164,46,194,16,64,96,210,177,230,52,145,161,56,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,94,145,240,205,191,25,50,142,77,177,222,41,220,250,208,236,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,229,179,142,63,209,236,134,238,122,156,106,178,199,155,37,240,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}
    outputHex := hex.EncodeToString(encodedConfig)
	fmt.Print(outputHex)

	
}


//https://etherscan.io/tx/0xb40632a5d387a0cbdff43e4b994f48b00a5f433d51abee08b41696b2b55fd19c#eventlog

/*
observationTimeout = "10s" the maximum duration to wait before an off-chain request for data is considered to be failed/unfulfillable
blockchainTimeout = "20s"  the maximum duration to wait before an on-chain request for data is considered to be failed/unfulfillable
contractConfigTrackerSubscribeInterval = "2m0s" the interval at which to retry subscribing to on-chain config changes if a subscription has not yet successfully been made
contractConfigTrackerPollInterval = "1m0s" the interval at which to proactively poll the on-chain config for changes
contractConfigConfirmations = 1 the number of blocks to wait after an on-chain config change before considering it worthy of acting upon
*/