Meteor.startup(function () {
  return Meteor.Mandrill.config({
    username: process.env.MANDRILLUSERNAME,
    key: process.env.MANDRILLAPIKEY
  });
});

this.sendEmail = function(to, subject, htmlText) {
    return Meteor.Mandrill.send({
        to: to,
        from: "noreply@inviteslack.me",
        subject: subject,
        html: htmlText
    });
};