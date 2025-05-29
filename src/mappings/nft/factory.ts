import { Address, Bytes, dataSource } from '@graphprotocol/graph-ts'
import { ChainWikiDeployed } from '../../types/NFTFactory/SX1155NFTFactory'
import { NFT, NFTFactory } from '../../wrappers'

export function handleCreateNFT(event: ChainWikiDeployed): void {
  let factoryAddress = dataSource.address().toHex()
  let factory = NFTFactory.loadOrCreate(factoryAddress)

  const tokenParams = event.params

  let address = changetype<Address>(event.params.deployedAddress)
  let nft = new NFT(address)

  nft.setUriJson(tokenParams.kya, event)

  nft.symbol = tokenParams.symbol
  nft.name = tokenParams.name

  nft.admins = event.params.admin.map<Bytes>((a) =>
    Bytes.fromHexString(a.toHexString()),
  )
  nft.editors = event.params.editor.map<Bytes>((e) =>
    Bytes.fromHexString(e.toHexString()),
  )

  nft.updatedAt = event.block.timestamp
  nft.createdAt = event.block.timestamp
  nft.creator = event.params.owner

  nft.save()
  factory.save()
}
