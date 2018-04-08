console.log('Rx.Observable ...')
console.log(Rx)
var requestStream = Rx.Observable.ajax('https://api.github.com/users')
requestStream.subscribe(function(requestUrl) {
  // execute the request
  var responseStream = Rx.Observable.create(function (observer) {
      console.log(observer)
      jQuery.getJSON(requestUrl)
      .done(function(response) { observer.onNext(response); })
      .fail(function(jqXHR, status, error) { console.log(error) })
      .always(function() { observer.onCompleted(); });
  });

  responseStream.subscribe(function(response) {
      // do something with the response
  });
}) 