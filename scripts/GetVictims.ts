import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import fs from 'fs'

async function main() {
  //   const wxBTRFLY = await ethers.getContractAt(
  //     '@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20',
  //     WXBTRFLY_ADDRESS,
  //   )
  //   const transferToContractEvents = await wxBTRFLY.queryFilter(
  //     wxBTRFLY.filters.Transfer(null, '0x085c46b94eea357279b301971f75eebf5bc1377b', null),
  //     14013090,
  //     14013091,
  //   )

  const transactionReciept = await ethers.provider.getTransactionReceipt(
    '0xf0e4ccb4f88716fa5182da280abdb9ea10ec1c61cfc5bbe87e10bdde07c229d6',
  )

  const victims: any = {}

  transactionReciept.logs.forEach((log) => {
    const { topics, data } = log
    const [eventHash, victimZeroPadded] = topics
    const victim = ethers.utils.defaultAbiCoder.decode(['address'], victimZeroPadded)[0]
    const btrflyAmount = Number(BigNumber.from(data).toString()) / 1e18
    const btrflyAmountWei = Number(BigNumber.from(data).toString())

    // Check if eventHash is Transfer event
    if (eventHash === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
      if (!victims[victim]) {
        victims[victim] = {
          btrflyAmount,
          btrflyAmountWei,
        }
      } else {
        victims[victim].btrflyAmount += btrflyAmount
        victims[victim].btrflyAmountWei += btrflyAmountWei
      }
    }
  })

  fs.writeFile('Victims.json', JSON.stringify([victims]), function (err) {
    if (err) {
      console.log(err)
    }
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
