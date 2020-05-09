/*let bytesReceivedTotal = 0
let clientId = ''

// TODO: Make sure it runs from the start, and not after first refresh
self.addEventListener('fetch', function(event) {
  let response 
  let myStream
  let result = fetch(event.request).then((res) => {
    console.log('Fetched this url: ' + event.request.url)
    if(event.request.url.includes('cdn.shopify.com')) {
      console.log(res)
    }
    response = res
    // Duplicate the stream so we can read it one place and send it on
    if(res.body) {
      let theStreams = res.body.tee()
      response.body = theStreams[0]
      myStream = theStreams[1]
      // Read our stream
      fetchStream(myStream, event.request)
    }

    // Pass on the response
    try {
      event.respondWith(response)
    } catch(err) {
      // console.log('Respond with failed.')
    }

    // If clientID hasn't been set yet, set it now
    if(!clientId && event.clientId) clientId = event.clientId
  })
})

function fetchStream(stream, req) {
  const reader = stream.getReader()
  let charsReceived = 0

  // read() returns a promise that resolves
  // when a value has been received
  reader.read().then(function processText({ done, value }) {
    // Result objects contain two properties:
    // done  - true if the stream has already given you all its data.
    // value - some data. Always undefined when done is true.
    if (done) {
      console.log('Received ' + bytesReceivedTotal + ' characters.')
      bytesReceivedTotal += charsReceived
      self.serviceWorker.postMessage({
        name: 'bytes',
        value: bytesReceivedTotal
      })
      return
    }

    // value for fetch streams is a Uint8Array
    charsReceived += value.length

    // Read some more, and call this function again
    return reader.read().then(processText)
  });
}*/