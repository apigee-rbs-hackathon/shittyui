var baseurl = 'http://bbank-test.apigee.net/v1/vaccounts';
var baasurl = 'https://api.usergrid.com/bbank/categories/vaccounts';

function nospaces(chunk, context, bodies, params) {
  return chunk.tap(function(data) {
    var newschtuff = data.replace(new RegExp(' ', 'g'), '');;
    return newschtuff;
  }).render(bodies.block, context).untap();
}
dust.helpers.nospaces = nospaces;

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
        $(document).on('click','.daSelector', function() {
          console.log("this is the id: %s", this.id);
          if ( this.id === "vaccounts" ) {
            showVaccounts();
          }
          else {
            showConfigureVaccounts();
          }
        });
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
//http://bbank-test.apigee.net/v1/vaccounts
  function showConfigureVaccounts() {
    console.log('running configure');
    async.waterfall([
      function(cb) {
        /*
        $.ajax({ url: baseurl,
          //headers: { apikey: key },
          success: function( data ) {
            cb( null, data );
          }
        });
        */
        cb( null, { "vaccounts": ['Fashion','Groceries','Eating Out','Recreational Lubrication','Insurance'] } );
      },
      function(data,cb) {
        var daOthers = [];
        /*
        data.vaccounts.forEach(function(i) {

        });
        */
        dust.render("configureVaccounts", data, function(err, out) {
          if (err != undefined) {
            console.log('This is the err: %s', err );
          }
          else {
            $('#page').empty();
            $('#page').html( out );
            $(document).on('click','#addVaccountBtn',function(){
            var newData = {
              "name": $('#vaccountName').val(),
              "tags": [$('#textMatch').val()],
              "id": "575fcfedad9cdc9e12f38e64",
              "limit": $('#limit').val() };
            addNewVaccount( newData );
          });

          }
        });
      }
    ],
    function(e,r) {
      if (e) {
        console.error('We failed with: %s', e);
      }
    }
  );
  }

//http://bbank-test.apigee.net/v1/vaccounts
  function showVaccounts() {
    async.waterfall([
      function(cb) {
        $.ajax({ url: baseurl,
          //headers: { apikey: key },
          success: function( data ) {
            cb( null, data );
          }
        });
      },
      function(data,cb) {
        dust.render("vaccounts", data, function(err, out) {
          if (err != undefined) {
            console.log('This is the err: %s', err );
          }
          else {
            $('#page').empty();
            $('#page').html( out );
          }
        });
      }
    ],
    function(e,r) {
      if (e) {
        console.error('We failed with: %s', e);
      }
    }
  );
  }

  function addNewVaccount( data ) {
  async.series([
    function(cb) {
      $.ajax({
        url: baasurl,
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(data),
        success: function( data ) {
          cb( null, data );
        }
      });
    }],
    function(err,res) {
      if (err) {
        console.log("This is the error: %s", err);
      }
      else {
        console.log("Succeeded in adding new order: %s", res);
        //$('#newOrderModalDialog').modal('hide');
        showVaccounts();
      }
    }
  );
}


  // Let's first populate our list of catalogs when we first load the page
  showNavbar();
  showVaccounts();
}); // end document ready
