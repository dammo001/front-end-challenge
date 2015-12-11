function domobj(){
  var self        =this;
  self.products   = [];

  self.getproducts = function(url){
    $.getJSON(url, function(response){
        var count = 0;
        for(i=0; i<response.sales.length ; i++){
          self.products.push( new productobj(response.sales[i], i)  );
          count += 1; 
          if (count === response.sales.length){
            self.updateproducthtml();
          }
        }
    });
  }
    
  self.updateproducthtml = function(){
    $.get('product-template.html', function(template){
      var counter = 0; 
      for( i=0; i< self.products.length ; i++){
        self.products[i].updatehtml(template);
        counter += 1; 
        if (counter === self.products.length){
          self.updatedom(); 
        }
      }
    });
  }
  
  self.updatedom = function(){
    var i=0
    thishtml='';
    for( i=0; i< self.products.length ; i++){
      thishtml += self.products[i].htmlview;
    }
    setTimeout(self.addxs.bind(self), 0); 
    $("#content").append(thishtml);
  }

  self.addxs = function(){
    $(".x").click(function(){
      $(this).parent().remove();
    });
  }
}

function productobj(product, i){
  var self          = this;
  self.photo        = product.photos.medium_half;
  self.description  = product.description;
  self.title        = product.name;
  self.tagline      = product.tagline;
  self.url          = product.url;
  self.htmlview     = "";
  self.index        = i;
  
  self.updatehtml= function(template){
      self.htmlview = 
      template.replace('{image}', self.photo)
      .replace('{title}', self.title)
      .replace('{tagline}', self.tagline)
      .replace('{url}', self.url)
      .replace('{description}', self.description);
  }
}

var page=new domobj();
page.getproducts('./data.json');

// I was pretty confused by what was going on at first, specifically that the resources weren't loading for me properly. 
// After mucking around for far too long, I realized that the problem was with the way the code had its event loop setup.
// In order for the correct HTML elements to be displayed on the page, the sequence of events is getproducts parses the JSON object,
// pushes each sales item into an array, then calls updateproducthtml on each. This pulls a blank template for how the object will be
// displayed in HTML. Each characteristic of the sales item is replaced by the actual version. This was the key rate limiting step,
// as you the original code has this setup so that $(.get) was called for EACH item. This resulted in the process being extremely slow,
// because the $(.get) operation is a costly asynchronous one. I refactored this by instead calling the get operation once at the beginning,
// then looping through everything synchronously. This made it much easier to time the necessary subsequent callback, updatedom,
// which appends all of the constructed HTML elements to the DOM. After that, I call addxs which appends a click listener to each 
// shopping item so that they can be closed. This needs to be called afterwards so that the listener has an element to append to. 

// I also removed the row/column system that the original code had because it made it very difficult to make it responsive. 
// My first attempt at this had some complicated @media selectors. I decided to just scrap that system and just use bootstrap's 
// grid system, as it yielded much better results with much much less code. I also refactored code for general readability. In the future,
// I would probably optimize by using a front end framework such as React/Flux. By diffing against a virtual DOM (cheap) instead
// of actually manipulating the DOM (costly), React updates in a really efficient manner. 
