import React, { Component } from 'react';
import EchoRegister from './../../contracts/EchoRegister';
import getWeb3 from "../../utils/getWeb3";
import LoomContract from "./../loom/LoomContract";


export default class ShowAccounts extends Component {
    state = { 
        currentIndexName: "", 
        web3: null, 
        accounts: null, 
        contract: null, 
        indexNameText: "",
        tokenToAddSymbol: "",
        tokenToAddAmount: 0
      };
    

    componentDidMount = async() => {
        //let contract = new SolContract();    

        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
      
            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
      
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = EchoRegister.networks[networkId];
            const instance = new web3.eth.Contract(
              EchoRegister.abi,
              deployedNetwork && deployedNetwork.address,
            );
      
            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3, accounts, contract: instance });
      

          } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
              `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
          }
    }

    loadAccounts = async() => {
        console.log("loadAccounts()");
        const {web3, accounts, contract} = this.state;
        console.log("using web3:" + web3.version)
        const response = await contract.methods.getAllRegistered().call();
        //console.log(response);


        this.setState({loadedAccounts: response});
    }

    loadIndexesForAccounts = async() => {
      console.log("loadIndexesforAccounts()");
      
      const loomContract = new LoomContract();
      await loomContract.loadContract();
      let loomInstance = loomContract.getContract();
      
      const {loadedAccounts} = this.state;
      let dexsForAddr = {};


      for (let r in loadedAccounts){
        console.log("r:", r, loadedAccounts[r]);
        let index = await loomInstance.methods.getIndexName(loadedAccounts[r]).call();
        console.log("index:", index);
        dexsForAddr[loadedAccounts[r]] = index;
      }

      this.setState({loadedAccounts:dexsForAddr});

      /*const {web3, accounts, contract, loadedAccounts} = this.state;

      if (loadedAccounts){
        const response = await contract.methods.getAllRegistered().call();
        let indexesForAddress = {}

        for (let i=0; i < response.length; i++){
          let index = await contract.methods.getIndexForAddress(response[i]).call();
          indexesForAddress[response[i]] = index;
        }

        this.setState({loadedAccounts:indexesForAddress})
        console.log(indexesForAddress);
      }else{
        console.error("call loadAccounts() first, this method uses that state");
      }*/
    }

    
  
    render() {
      const {loadedAccounts} = this.state;
      let accountText = "";

      if (loadedAccounts){
        accountText = JSON.stringify(loadedAccounts);
      }

    return (
        <div class="container-fluid padding">
            <div class="padding">
                <button class="btn btn-outline-secondary" onClick={this.loadAccounts}>Load Accounts</button>
                <button class="btn btn-outline-secondary" onClick={this.loadIndexesForAccounts}>Load Indexes For Accounts</button>
            </div>
            <div>
              {accountText}
            </div>
        </div>
    );
  }
}

