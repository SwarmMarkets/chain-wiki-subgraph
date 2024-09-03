import { Address, Bytes, dataSource } from '@graphprotocol/graph-ts'
import { SX1155NFTDeployed } from '../../types/NFTFactory/SX1155NFTFactory'
import { NFT, NFTFactory } from '../../wrappers'

export function handleCreateNFT(event: SX1155NFTDeployed): void {
  let factoryAddress = dataSource.address().toHex()
  let factory = NFTFactory.loadOrCreate(factoryAddress)

  const params = event.params

  let address = changetype<Address>(event.params.deployedAddress)
  let nft = new NFT(address)

  nft.setUriJson(event.params.uri, event)

  nft.symbol = params.symbol
  nft.name = params.name

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
