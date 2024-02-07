import { log } from '@graphprotocol/graph-ts/index'
import { NFTFactory as SchematicNFTFactory } from '../types/schema'

export class NFTFactory extends SchematicNFTFactory {
  private constructor(id: string) {
    super(id)
  }

  static loadOrCreate(id: string): NFTFactory {
    let factory = NFTFactory.load(id)

    if (factory === null) {
      factory = new NFTFactory(id)
    }

    return changetype<NFTFactory>(factory)
  }

  static mustLoad(id: string): NFTFactory {
    let factory = NFTFactory.load(id)

    if (factory === null) {
      log.critical('BundleTokenFactory not found: {}', [id])
    }

    return changetype<NFTFactory>(factory)
  }
}
