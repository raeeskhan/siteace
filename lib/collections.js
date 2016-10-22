Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");

Websites.allow({
	insert:function(userId, doc) {
		if(doc.url == "" || doc.description == "")  {
			return false;
		}		
		else {
			return true;
		}
	},
	update:function(userId, doc) {

		return true;
	}	
})

Comments.allow({
	insert:function(userId, comment){
		return true;
	}

})