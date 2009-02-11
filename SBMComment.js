/*
 * SBMComment.js
 * 
 * Copyright (c) 2008 katsuma.tv
 * SBMComment.js is freely distributable under the terms of an MIT-style license.
 */
var SBMComment = {
	
	url: '',
	area: '',
	filter : function(){},

	load : function(param){
		param = param || {};
		this.url = param.url || location.href;
		this.area = param.area || '';
		this.filter = (typeof(param.filter)=='function') ? param.filter : this._filter;
		this.nums = param.nums || '';

		var d= document;
		// thanks! http://pipes.yahoo.com/poolmmjp/sbm_bookmarks_api
		var url = 'http://pipes.yahoo.com/pipes/pipe.run?_id=3J_WV8j_2xGssdY4qWIyXQ&_render=json&_run=1&url=';
		url += encodeURIComponent(this.url.replace(/%23/, '#'));
		url += '&_callback=' + 'SBMComment.insert'
		var head = d.getElementsByTagName('head').item(0);
		var s = d.createElement('script');	
		s.setAttribute('type', 'text/javascript');
		s.setAttribute('src', url);
		s.setAttribute('charset', 'UTF-8');
		head.appendChild(s);
	
	},
	
	insert : function(data){
		if(data==null || !data.count || !data.value || !data.value.items) return;
		var bookmarks = data.value.items;
		var types = this.types;
		var inserted = '';
		var area = this.area;
		var d = document;
		for(var i=bookmarks.length-1; i>=0; i-- ){
			var bookmark = bookmarks[i];
			var b = {};
			b.id = bookmark['created_on'] || '';
			b.title = bookmark['title'] || '';
 			b.type = b.title.substring(b.title.indexOf('[')+1, b.title.indexOf(']'));
			b.author = bookmark['author'] || '';
			b.published = bookmark['y:published'] || null;
			b.comment = bookmark['description'] || '';
			b.tags = bookmark['tags'] || '';
			b.link = bookmark['link'] || '';
			
			inserted += this.filter(b);
		}
		
		if(area){
			d.getElementById(area).innerHTML = inserted;
		} else{
			d.write(inserted);
		}
		
		if(this.nums) d.getElementById(this.nums).innerHTML = bookmarks.length;
	},
	
	/*
	 *  default filter function
	 *  You can override this function by param.filter
	 */
	_filter : function(bookmark){
		if(bookmark==null) return '';
		var d = [], published = bookmark.published;
		d.push('<p id="' + bookmark.id + '">');
		d.push('<span class="sbm-comment-name">');
		d.push('<a href="' + bookmark.link + '">' + bookmark.author + '</a>');
		d.push('</span>');
		d.push(' from <span class="sbm-comment-type-' + bookmark.type + '">' + bookmark.type + '</span>');
		d.push(' at <span class="sbm-comment-date">' + published.year + '-' + published.month + '-' + published.day + ' ' + published.hour + ':' + published.minute + '</span>');
		d.push('</p>');
		d.push('<p class="sbm-comment-description">' + bookmark.comment + '</p>');
		return d.join('');	
	}
}

