/*
 * Raw data
 * ********
 *
 * Here we do some fairly simple stuff; no combining multiple streams or
 * anything fancy, just take the raw data from the API annd return it
 *
 * We also support markers, which you can add by pressing keys
 *
 */
const Cortex = require("../lib/cortex");
var firebase = require("firebase");
var myName = 'mehani';
var firebaseConfig = {
    apiKey: "AIzaSyAxQ7xo6_YDwYLYHqjSgy4kVhcchM_25TM",
    authDomain: "cerebrex-c0a9a.firebaseapp.com",
    databaseURL: "https://cerebrex-c0a9a.firebaseio.com",
    projectId: "cerebrex-c0a9a",
    storageBucket: "cerebrex-c0a9a.appspot.com",
    messagingSenderId: "581559446579"
  };


firebase.initializeApp(firebaseConfig);

var database = firebase.database();



function writeUserData(userId, name) {
  firebase.database().ref('users/' + userId).set({
    username: name
  });
}

writeUserData(1,myName);


function raw(client, onResult) {
  return client
    .createSession({ status: "active" })
    .then(() => client.subscribe({ streams: ["eeg"] }))
    .then(subs => {
      if (!subs[0].eeg) throw new Error("failed to subscribe");

      const headers = subs[0].eeg.cols.slice();
      headers.unshift("seq", "time");
      headers.headers = true;

      let n = 0;
      const onEeg = data => {
        if (n === 0) onResult(headers);
        onResult([n, data.time].concat(data.eeg));
        n++;
      };

      client.on("eeg", onEeg);

      return () =>
        client
          .inspectApi()
          .then(() => client.unsubscribe({ streams: ["eeg"] }))
          .then(() => client.updateSession({ status: "close" }))
          .then(() => client.removeListener("eeg", onEeg));
    });
}

if (require.main === module) {
  process.on("unhandledRejection", err => {
    throw err;
  });

  const readline = require("readline");
  const stdin = process.stdin;
  readline.emitKeypressEvents(stdin);
  if (stdin.isTTY) stdin.setRawMode(true);

  const verbose = process.env.LOG_LEVEL || 1;
  const options = { verbose };
  const client = new Cortex(options);
  // these values need to fill to run example
  const auth = {
    username: "prashanb",
    password: "Basti123",
    client_id: "BP9CKBpyiA0RbZqAXe7uEiDRju9m4N02e3KPWBlz",
    client_secret: "n8ymWHCgndLBSYbIn2XShGLyb6WIc8I6dBMVRb84ZFsOciVjX3KZWsgFSgPCmbkxfmMRlVtmk6NmmjjvO7H8FYvCLH4Wt3nQ2hXi4QTsO4YjSneJra6jGpTwxgPha1dx",
    debit: 1 // first time you run example debit should > 0
  };
 var y="hi";
 var dataArray = ["mehani"];
 dataArray.id="dataArrayId";

  client.ready
    .then(() => client.init(auth))
    .then(() => raw(client, rawData => dataArray.push(rawData.join(','))))
    .then(finish => {
      console.warn(
        "Streaming raw data as CSV. Press any key to add a marker or escape to stop."
      );

      return new Promise(resolve => {
        stdin.on("keypress", (char, key) => {
          const time = new Date();
          const { ctrl, alt, meta, name } = key;
          if (!ctrl && !alt && !meta && name.match(/^[a-z0-9]$/)) {
            client
              .injectMarker({ label: "key", value: name, time })
              .then(() => {
                const ftime = `${time.toLocaleTimeString()}.${time.getMilliseconds()}`;
                console.warn(`Added marker ${name} at time ${ftime}`);
              });
          } else if (name === "escape" || (ctrl && name === "c")) {
            stdin.removeAllListeners("keypress");
            stdin.pause();
            resolve(finish());
          }
        });
      });
    })
    .then(() => client.close())
    .then(() => {
        dataArray.forEach(function (item,index,array) {
            console.log(item,index);
            JSON.stringify(dataArray);
            console.log(y);
        });
      console.warn("Finished!");
    });
   

  // We could use the value returned by numbers) here, but when we ctrl+c it
  // will clean up the connection anyway
}


module.exports = raw;
