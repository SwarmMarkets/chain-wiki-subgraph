import { Address, Bytes, dataSource } from '@graphprotocol/graph-ts'
import { ChainWikiDeployed } from '../../types/NFTFactory/SX1155NFTFactory'
import { NFT, NFTFactory } from '../../wrappers'

export function handleCreateNFT(event: ChainWikiDeployed): void {
  let factoryAddress = dataSource.address().toHex()
  let factory = NFTFactory.loadOrCreate(factoryAddress)

  const tokenParams = event.params.tokenParams

  let address = changetype<Address>(event.params.deployedAddress)
  let nft = new NFT(address)

  nft.setUriJson(tokenParams.kya, event)

  nft.symbol = tokenParams.symbol
  nft.name = tokenParams.name

  const editor = Bytes.fromHexString(event.params.editor.toHex())
  const admin = Bytes.fromHexString(event.params.admin.toHex())

  nft.admins = [admin]
  nft.editors = [editor]

  nft.updatedAt = event.block.timestamp
  nft.createdAt = event.block.timestamp
  nft.creator = event.params.admin

  nft.save()
  factory.save()
}
