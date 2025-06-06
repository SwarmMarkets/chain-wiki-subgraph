import { RoleSet } from '../../types/NFTFactory/SX1155NFT'
import { NFT } from '../../wrappers'

export function handleRoleGranted(event: RoleSet): void {
  const nft = NFT.mustLoad(event.address.toHex())

  if (event.params.active) {
    nft.grantRole(event.params.role, event.params.holder)
  } else {
    nft.revokeRole(event.params.role, event.params.holder)
  }
  nft.save()
}
