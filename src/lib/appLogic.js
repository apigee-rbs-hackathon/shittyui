var baseurl = 'http://bbank-test.apigee.net/v1/vaccounts';

var vaccounts = {
	"accId" : 12345,
	"balance" : 300,
	"vaccounts" : [
		{
			"name" : "Mortgage",
			"limit" : "1200",
			"balance" : "1200",
			"txs" : [
				{ "desc" : "Home Mortgage", "payee": "23413135", "amount" : "1200", "txdate" : "20160618","txid" : "2113135235" }
			]
		},
		{
			"name" : "bananas and blow",
			"limit" : "100",
			"balance" : "68.5",
			"txs" : [
				{ "desc" : "bananas", "payee": "123456", "amount" : "1.5", "txdate" : "20160618","txid" : "235235235" },
				{ "desc" : "blow", "payee": "654321", "amount" : "10", "txdate" : "20160617", "txid" : "370923823" },
				{ "desc" : "blow", "payee": "654321", "amount" : "10", "txdate" : "20160616", "txid" : "370923823" },
				{ "desc" : "blow", "payee": "654321", "amount" : "10", "txdate" : "20160615", "txid" : "370923823" }
			]
		},
		{
			"name" : "groceries",
			"limit": "200",
			"balance": "225",
			"txs" : [
				{ "desc" : "lidl", "payee": "3462352", "amount" : "65", "txdate" : "20160618", "txid": "10938209358" },
				{ "desc" : "aldi", "payee": "73452311", "amount" : "30", "txdate" : "20160617", "txid": "209370233" },
				{ "desc" : "aldi", "payee": "73452311", "amount" : "20", "txdate" : "20160616", "txid": "209370234" },
				{ "desc" : "aldi", "payee": "73452311", "amount" : "40", "txdate" : "20160614", "txid": "209370235" },
				{ "desc" : "aldi", "payee": "73452311", "amount" : "50", "txdate" : "20160611", "txid": "209370236" }
			]
		}
	]
};

function nospaces(chunk, context, bodies, params) {
  return chunk.tap(function(data) {
    var newschtuff = data.replace(new RegExp(' ', 'g'), '');;
    return newschtuff;
  }).render(bodies.block, context).untap();
}
dust.helpers.nospaces = nospaces;

dust.helpers.biggerThan = function(chunk, context, bodies, params) {
  var left = params.left, right = params.righ,
      body = bodies.block;
  if (left > right) {
    chunk.write('.');
    chunk.render(body, context);
  } else if (location === 'end') {
    chunk.render(body, context);
    chunk.write('.');
  } else {
    dust.log('WARN', 'missing parameter "location" in period helper');
  }
  return chunk;
};

function biggerThan(chunk, context, bodies, params) {
  return chunk.tap(function(data) {
    var newschtuff = data.replace(new RegExp(' ', 'g'), '');;
    return newschtuff;
  }).render(bodies.block, context).untap();
}
dust.helpers.biggerThan = biggerThan;

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
  function showVaccounts(acctid) {
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
        console.log('the data: %s', util.inspect(data,null,true));
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

  // Let's first populate our list of catalogs when we first load the page
  //showNavbar();
  showVaccounts(134);
}); // end document ready
