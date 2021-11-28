import os
import sys


job ='''
type = "offchainreporting"
schemaVersion = 1
contractAddress = "{}"
p2pPeerID = "{}"
p2pBootstrapPeers = [
"/ip4/10.5.0.8/tcp/3002/p2p/{}"
]
isBootstrapPeer = false
keyBundleID = "{}"
transmitterAddress = "{}"
observationTimeout = "10s"
blockchainTimeout = "20s"
contractConfigTrackerSubscribeInterval = "2m0s"
contractConfigTrackerPollInterval = "1m0s"
contractConfigConfirmations = 1
observationSource = """
    // data source 1
    ds1          [type=http method=GET url="http://10.5.0.6:3000/get?tracker={}"]

    ds1
"""
maxTaskDuration = "0s"
externalJobID = "0eec7e1d-d0d2-476c-a1a8-72dfb6633f06"
'''

bootsrap_job='''
type               = "offchainreporting"
schemaVersion      = 1
contractAddress    = "{}"
p2pBootstrapPeers  = []
isBootstrapPeer = true
externalJobID   = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F06"
'''

def getConf():
    filename = "jobs/conf.txt"
    with open(filename) as file:
        lines = file.readlines()
        lines = [line.rstrip() for line in lines]
    conf={}
    conf["keyb_id"] = (lines[0].split("="))[1].split(",")
    conf["p2p_id"] = (lines[1].split("="))[1].split(",")
    conf["transmit_address"] = (lines[2].split("="))[1].split(",")
    conf["names"] = (lines[3].split("="))[1].strip()
    conf["ocr"] = (lines[4].split("="))[1].strip()
    conf["tracker"] = (lines[5].split("="))[1].strip()
    conf["boots_peer"] = (lines[6].split("="))[1].strip()
    return conf

def main(n):
    conf = getConf()
    for i in range(0,n):
        new_job = job.format(conf["ocr"].strip(),conf["p2p_id"][i].strip(),conf["boots_peer"].strip(),
            conf["keyb_id"][i].strip(),conf["transmit_address"][i].strip(),conf["tracker"].strip())
        f = open("jobs/job_oracle_{}.toml".format(str(i+1)), "w")
        f.write(new_job)
        f.close()
    
    boot_job = bootsrap_job.format(conf["ocr"].strip())
    f = open("jobs/bootstrap.toml", "w")
    f.write(boot_job)
    f.close()
	

if __name__ == "__main__":
	main(int(sys.argv[1]))
	
