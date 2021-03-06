import {
    Client, LocalAddress, CryptoUtils, LoomProvider
  } from 'loom-js';
  
  import Web3 from 'web3';
  import EchoApp from './../../contracts/EchoApp.json';  

  export default class LoomContract {
    async loadContract() {
      this._createClient();
      this._createCurrentUserAddress();
      this._createWebInstance();
      await this._createContractInstance();
    }
  
    _createClient() {
      this.privateKey = CryptoUtils.generatePrivateKey();
      this.publicKey = CryptoUtils.publicKeyFromPrivateKey(this.privateKey);
      let writeUrl = 'ws://192.168.43.120:46658/websocket';
      let readUrl = 'ws://192.168.43.120:46658/queryws';
      let networkId = 'default';
  
      if (process.env.NETWORK == 'extdev') {
        writeUrl = 'ws://extdev-plasma-us1.dappchains.com:80/websocket';
        readUrl = 'ws://extdev-plasma-us1.dappchains.com:80/queryws';
        networkId = 'extdev-plasma-us1';
      }
  
      this.client = new Client(networkId, writeUrl, readUrl);
  
      this.client.on('error', msg => {
        console.error('Error on connect to client', msg);
        console.warn('Please verify if loom command is running');
      })
    }
  
    _createCurrentUserAddress() {
      this.currentUserAddress = LocalAddress.fromPublicKey(this.publicKey).toString();
    }
  
    _createWebInstance() {
      this.web3 = new Web3(new LoomProvider(this.client, this.privateKey));
    }

    getContract() {
      return this.echoAppInstance;
    }
  
    getCurrentUserAddress(){
      return this.currentUserAddress;
    }

    async _createContractInstance() {
      const networkId = await this._getCurrentNetwork();
      this.currentNetwork = EchoApp.networks[networkId];
  
      if (!this.currentNetwork) {
        throw Error('Contract not deployed on DAppChain');
      }
  
      
      this.echoAppInstance = new this.web3.eth.Contract(EchoApp.abi, this.currentNetwork.address, {
        from: this.currentUserAddress
      })
  
      /*this.simpleStoreInstance.events.NewValueSet({ filter: { _value: 10 }}, (err, event) => {
        if (err) console.error('Error on event', err)
        else {
          if (this.onEvent) {
            this.onEvent(event.returnValues)
          }
        }
      })
  
      this.simpleStoreInstance.events.NewValueSetAgain({ filter: { _value: 47 }}, (err, event) => {
        if (err) console.error('Error on event', err)
        else {
          setTimeout(() => alert("Loooomy help me :)"))
          if (this.onEvent) {
            this.onEvent(event.returnValues)
          }
        }
      })*/
    }
  
    /*addEventListener(fn) {
      this.onEvent = fn
    }*/
  
    async _getCurrentNetwork() {
      //return Promise.resolve('default')
      return await this.web3.eth.net.getId();
    }
  /*
    async setValue(value) {
      // Just a small test with Loomy
      if (value == 47) {
        return await this.simpleStoreInstance.methods.setAgain(value).send({
          from: this.currentUserAddress
        })
      }
  
      return await this.simpleStoreInstance.methods.set(value).send({
        from: this.currentUserAddress
      })
    }*/
    /*
    async getValue() {
      return await this.simpleStoreInstance.methods.get().call({
        from: this.currentUserAddress
      })
    }*/
  }
  