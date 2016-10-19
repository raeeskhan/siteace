Websites = new Mongo.Collection("websites");

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