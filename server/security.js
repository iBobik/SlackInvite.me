Security.defineMethod("ifCurrentUserIsCreator", {
  fetch: [],
  transform: null,
  deny: function(type, arg, userId, doc) {
    return userId !== doc.createdBy;
  }
});

Security.defineMethod("ifUserIsComAdmin", {
  fetch: [],
  transform: null,
  deny: function(type, arg, userId, doc) {
    var community = CommunityList.findOne(doc.communityId);
    return userId !== CommunityList.findOne(doc.communityId).createdBy;
  }
});

CommunityList.permit(['insert']).ifLoggedIn().apply();
MemberList.permit(['insert']).apply();
CommunityList.permit(['update']).ifLoggedIn().ifCurrentUserIsCreator().apply();
MemberList.permit(['update']).ifLoggedIn().ifUserIsComAdmin().apply();
