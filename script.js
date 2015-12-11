
function domobj(){
  var self        =this;
  self.products   = [];

  self.getproducts = function(url){
    var count = 0;
    $.getJSON(url, function(response){
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
      if (i % 3 == 0 ){  thishtml += "<div class='row'>";}
      thishtml += self.products[i].htmlview;
      if ((i % 3 == 2) || i == (self.products.length-1) ){thishtml += "</div>";}
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
  self.photo        = product.photos.medium_half
  self.description  = product.description
  self.title        = product.name
  self.tagline      = product.tagline
  self.url          = product.url
  self.htmlview     = ""
  self.index        = i
  self.custom_class = "col"+ ((i % 3) +1) 
  
  self.updatehtml= function(template){
      self.htmlview = template.replace('{image}', self.photo).replace('{title}', self.title).replace('{tagline}', self.tagline).replace('{url}', self.url).replace('{description}', self.description).replace('{custom_class}', self.custom_class);
  }
}

var page=new domobj();
page.getproducts('./data.json');




