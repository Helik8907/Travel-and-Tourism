const asyncHandler = require('../middleware/asyncHandler');

/**
 * Builds toggleLike/toggleDislike handlers for a model that tracks
 * like_count/dislike_count, keeping them in sync with the user's
 * <field>_liked/<field>_disliked arrays. Liking removes an existing
 * dislike and vice versa.
 */
const createReactionHandlers = (Model, entityName, userField) => {
  const likedField = `${userField}_liked`;
  const dislikedField = `${userField}_disliked`;

  const toggleLike = asyncHandler(async (req, res) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: `${entityName} not found` });
    }

    const alreadyLiked = req.user[likedField].some((id) => id.equals(doc._id));
    const alreadyDisliked = req.user[dislikedField].some((id) => id.equals(doc._id));

    if (alreadyLiked) {
      req.user[likedField].pull(doc._id);
      doc.like_count = Math.max(0, doc.like_count - 1);
    } else {
      req.user[likedField].push(doc._id);
      doc.like_count += 1;
      if (alreadyDisliked) {
        req.user[dislikedField].pull(doc._id);
        doc.dislike_count = Math.max(0, doc.dislike_count - 1);
      }
    }

    await req.user.save();
    await doc.save();

    res.status(200).json({ liked: !alreadyLiked, like_count: doc.like_count, dislike_count: doc.dislike_count });
  });

  const toggleDislike = asyncHandler(async (req, res) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: `${entityName} not found` });
    }

    const alreadyDisliked = req.user[dislikedField].some((id) => id.equals(doc._id));
    const alreadyLiked = req.user[likedField].some((id) => id.equals(doc._id));

    if (alreadyDisliked) {
      req.user[dislikedField].pull(doc._id);
      doc.dislike_count = Math.max(0, doc.dislike_count - 1);
    } else {
      req.user[dislikedField].push(doc._id);
      doc.dislike_count += 1;
      if (alreadyLiked) {
        req.user[likedField].pull(doc._id);
        doc.like_count = Math.max(0, doc.like_count - 1);
      }
    }

    await req.user.save();
    await doc.save();

    res.status(200).json({ disliked: !alreadyDisliked, like_count: doc.like_count, dislike_count: doc.dislike_count });
  });

  return { toggleLike, toggleDislike };
};

module.exports = createReactionHandlers;
