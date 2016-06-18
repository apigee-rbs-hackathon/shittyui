// document ready stuff
$(function() {
  function showNavbar() {
    dust.isDebug = true;
    dust.render("navbar", {}, function(err,out) {
      if (err != undefined) {
        console.log('This is the err: %s', err );
      }
      else {
        $('#navbar').empty();
        $('#navbar').html( out );
        /*
        $(document).on('click','.customerSelector', function() {
          showOrderList( this.id );
        });
        */
      }
    });
  }

  function showMainPage() {
    dust.render("mainPage", {}, function(err, out) {
      if (err != undefined) {
        console.log('This is the err: %s', err );
      }
      else {
        $('#page').empty();
        $('#page').html( out );
      }
    });
  }

  // Let's first populate our list of catalogs when we first load the page
  showNavbar();
  showMainPage();
}); // end document ready
