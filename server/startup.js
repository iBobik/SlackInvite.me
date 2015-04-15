Meteor.startup(function () {
    CommunityList._ensureIndex({slack_domain: 1}, {unique: 1});
    return Meteor.Mandrill.config({
        username: process.env.MANDRILLUSERNAME,
        key: process.env.MANDRILLAPIKEY
    });
});

this.sendEmail = function(to, subject, htmlText) {
    return Meteor.Mandrill.send({
        to: to,
        from: "noreply@slackinvite.me",
        subject: subject,
        html: htmlText
    });
};