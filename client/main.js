import { Template } from 'meteor/templating';

import './main.html';

//Router.configure({
//	layoutTemplate: 'ApplicationLayout'
//});

Router.route('/', function() {
	//this.render("website_form");
	this.render("main_page")
});

Router.route('/website/:_id', function () {
  this.render("website_details", {
    data:function(){
      return Websites.findOne({_id:this.params._id});
    }
  });
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"

});
// template helpers
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({}, {sort: {up:-1}});
		},

	});
	Template.registerHelper("formattedDate", function (){
			//console.log("its user:"+this.comment);
			return moment(this.createdOn).format("DD/MM/YY");

	});

	Template.comment_list.helpers({
		comments:function(){
			return Comments.find({website_id:this._id});
		}
	});

		/////
	// template events
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			// put the code in here to add a vote to a website!
			if(!this.up) {
				this.up = 0;
			}
			Websites.update({_id:website_id}, {$set: {up:this.up+1}});
			return false;// prevent the button from reloading the page
		},
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);

			// put the code in here to remove a vote from a website!
			if(!this.down) {
				this.down = 0;
			}
			Websites.update({_id:website_id}, {$set: {down:this.down+1}});
			return false;// prevent the button from reloading the page
		}
	})

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		},
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:

			var url = event.target.url.value;
			console.log("The url they entered is: "+url);
			//var title = event.target.title.value;
			//var description = event.target.description.value;

			//  put your website saving code in here!	

			
			if(Meteor.user()) {
				Meteor.call("getUrlData", url, function(error, results){
				
				var temp = $('<div></div>');
				temp.html(results.content);
				var title = $('title', temp).text();
				console.log("the Now: "+title);
				var description = $('meta[name="description"]',temp).attr('content');

				Websites.insert({
					title:title,
					url:url,
					description:description,
					createdOn:new Date(),
            		up: 0,
            		down: 0

				});
			 });	
			}

			return false;// stop the form submit from reloading the page

		}
	});

	Template.comment_form.events({
		"submit .js-save-comment-form":function(event) {
				var comment = event.target.comment.value;
				console.log("You commented: "+comment);
				var website_id = this._id;
				console.log("for website id: "+website_id);
				var user = Meteor.user().username;
				console.log("user: "+user);
				if(Meteor.user()) {

					Comments.insert({website_id:website_id, user:user, comment:comment, createdOn: new Date()});

				   }

				return false;

		}
	})

	Template.website_details.rendered = function() {		
		$(".js-details").text("Main");
		$(".js-details").attr('href', '/');	

	};
	