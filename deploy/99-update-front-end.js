const { ethers, network } = require("hardhat")
const fs = require("fs")
const FRONT_END_ADDRESSES_FILE = "../nextjs-decentralized-lottery/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../nextjs-decentralized-lottery/constants/abi.json"
module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating frontend...")
        updateContractAddresses()
        updateABI()
    }
}

async function updateContractAddresses() {
    const raffle = await ethers.getContract("Raffle")
    const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE), "utf8")
    const chainId = network.config.chainId?.toString()
    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(raffle.address)) {
            currentAddresses[chainId].push(raffle.address)
        }
    } else {
        currentAddresses[chainId] = [raffle.address]
    }

    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}

async function updateABI() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
}

module.exports.tags = ["all", "frontend"]
