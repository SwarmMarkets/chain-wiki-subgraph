import { json, log, store } from '@graphprotocol/graph-ts'
import { CommentRemoved, Commented } from '../../types/templates/NFT/SX1155NFT'
import { jsonUtils } from '../../utils/json'
import { Comment } from '../../wrappers/comment'
import { Token } from '../../wrappers/nft-token'

export function handleComment(event: Commented): void {
  const nftAddress = event.address
  const tokenId = event.params.tokenId
  const commentId = event.params.commentId

  const tokenCreatedId = Token.buildID(nftAddress, tokenId)
  const comment = new Comment(nftAddress, tokenId, commentId)

  const commentJsonValue = json.try_fromString(event.params.comment)

  if (commentJsonValue.isError) {
    log.warning('WARNING: Failed to parse json from string. CommentId: {}', [
      comment.id,
    ])
    return
  }

  const commentData = commentJsonValue.value.toObject()

  if (commentData.entries.length === 0) {
    log.warning('WARNING: JSON is empty. CommentId: {}', [comment.id])
    return
  }

  const jsonSectionId = commentData.get('sectionId')
  const jsonMessageUri = commentData.get('uri')

  if (jsonSectionId === null || jsonMessageUri === null) {
    log.warning('WARNING: Invalid JSON format. CommentId: {}', [comment.id])
    return
  }

  const sectionId = changetype<string>(jsonUtils.parseString(jsonSectionId))
  const messageUri = changetype<string>(jsonUtils.parseString(jsonMessageUri))

  comment.sectionId = sectionId
  comment.uri = messageUri

  comment.commentator = event.params.commentator
  comment.createdAt = event.block.timestamp
  comment.token = tokenCreatedId

  comment.save()
}

export function handleCommetRemoved(event: CommentRemoved): void {
  const nftAddress = event.address
  const tokenId = event.params.tokenId
  const commentId = event.params.commentId
  const id = Comment.buildID(nftAddress, tokenId, commentId)

  store.remove('Comment', id)
}
