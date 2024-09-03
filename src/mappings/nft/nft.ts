import { ContractURISet } from '../../types/NFTFactory/SX1155NFT'
import { NFT } from '../../wrappers'

export function handleUpdateNFTUri(event: ContractURISet): void {
  const nft = NFT.mustLoad(event.address.toHexString())

  nft.setUriJson(event.params.uri, event, true)
  nft.updatedAt = event.block.timestamp

  nft.save()
}
