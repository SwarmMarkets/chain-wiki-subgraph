import { RoleGranted, RoleRevoked } from '../../types/NFTFactory/SX1155NFT'
import { NFT } from '../../wrappers'

export function handleRoleGranted(event: RoleGranted): void {
  const nft = NFT.mustLoad(event.address.toHex())
  nft.grantRole(event.params.role, event.params.account)
  nft.save()
}

export function handleRoleRevoked(event: RoleRevoked): void {
  const nft = NFT.mustLoad(event.address.toHex())
  nft.revokeRole(event.params.role, event.params.account)
  nft.save()
}
