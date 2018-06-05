import React from 'react';
import getWeb3 from '../../utils/getWeb3'

import {Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail} from 'react-bootstrap';

export default class Admin extends React.Component {
  
  constructor(props) {
     super(props)

     this.state = {
       admin: false,
       web3: null
     }

  }

  componentWillMount() {
      // Get network provider and web3 instance.
      // See utils/getWeb3 for more info.

      getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        // Get accounts.
        results.web3.eth.getAccounts((error, accounts) => {
          this.setState({account:accounts[0]});
        })
      }).catch(() => {
        console.log('Error finding web3.')
      })

      const { match, contract } = this.props;
      // const selectedId = match.params.id;

      this.MyIdolContract = contract;

  }


  checkBalance(){
    this.MyIdolContract.checkBalances().then( balance => {
      console.log("Contract Balance: " + balance.toNumber()/1000000000000000000 + " ETH");
    });
  }

  withdrawBalance(){
    this.MyIdolContract.withdrawBalances.sendTransaction({from:this.state.account});
  }


  render() {

    return (
      <div>
        <h1>{this.contract}</h1>
        <div>
          <Button bsStyle="primary" id="checkButton" onClick={this.checkBalance.bind(this)}>
            Check Balance
          </Button>
          <Button bsStyle="primary" id="withdrawButton" onClick={this.withdrawBalance.bind(this)}>
            Withdraw Balance
          </Button>
        </div>
      </div>
    )
  }
}
