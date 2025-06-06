import { Address, Bytes, dataSource } from '@graphprotocol/graph-ts'
import { ChainWikiDeployed } from '../../types/NFTFactory/SX1155NFTFactory'
import { NFT, NFTFactory } from '../../wrappers'

export function handleCreateNFT(event: ChainWikiDeployed): void {
  let factoryAddress = dataSource.address().toHex()
  let factory = NFTFactory.loadOrCreate(factoryAddress)

  const nftParams = event.params

  let address = changetype<Address>(nftParams.chainWiki)
  let nft = new NFT(address)

  nft.setUriJson(nftParams.data.kya, event)

  nft.symbol = nftParams.data.symbol
  nft.name = nftParams.data.name

  nft.slug = nftParams.slug.toString()

  nft.admins = event.params.roles.admins.map<Bytes>((a) =>
    Bytes.fromHexString(a.toHexString()),
  )
  nft.editors = event.params.roles.editors.map<Bytes>((e) =>
    Bytes.fromHexString(e.toHexString()),
  )

  nft.updatedAt = event.block.timestamp
  nft.createdAt = event.block.timestamp
  nft.creator = event.params.roles.owner

  nft.save()
  factory.save()
}
