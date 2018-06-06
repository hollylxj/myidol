import React, { Component } from 'react'
import MyIdolContract from '../node_modules/myidol/build/contracts/MyIdol.json'
import getWeb3 from './utils/getWeb3'

import logo from './logo.jpg'
import PropTypes from 'prop-types'

import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import Toolbar from 'material-ui/Toolbar'

import {Alert,Navbar, Jumbotron, Button, Panel,Carousel, Grid,Col, Row} from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link, NavLink} from 'react-router-dom';



import Idols from './pages/Idols'
import Admin from './pages/Admin'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'




class App extends Component {
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

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')

    //Extract contract ABI
    const myIdol = contract(MyIdolContract);

    //Set Web3 Providers
    myIdol.setProvider(this.state.web3.currentProvider);
    console.log(this.state.web3.currentProvider);

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      console.log(accounts);
      console.log({userAccount: accounts[0]});
      this.setState({account:accounts[0]});

      myIdol.deployed().then((instance) => {
        console.log("Successfully deployed MyIdol");
        console.log(instance);
        this.setState({MyIdolInstance : instance});

        instance.owner().then(result => {
          console.log("Contract Owner: " + result);
          console.log("Current Account: " + this.state.account);
          console.log("IsOwner: " + (result==this.state.account));
          this.setState({admin:result==this.state.account});
        });
      });

    })
  }

  change(){




  }

  render() {

    let AdminDisplay = this.state.admin?        
          <Link to="/produce101/admin"><Button bsStyle="info">Admin</Button></Link>:null;

    return (
        <div>
          <Router basename={'/myidol/'}>
            <div className="App">
              <header>
                <img src={logo} className="App-logo" alt="logo.jpg" />
                <h1 className="App-title">My Idol</h1>
              </header>
              <div>
                <Link to="/produce101"><Button  bsStyle="info">Main Page</Button></Link>
                &emsp;
                <Link to="/produce101/idols"><Button  bsStyle="info">Idols</Button></Link> 
                &emsp;
                {AdminDisplay}
        

                <Switch>
                  <Route path="/produce101/admin" render={(props) => <Admin {...props} contract={this.state.MyIdolInstance} />} />
                  <Route path="/produce101/idols" render={(props) => <Idols {...props} />} />
                  <Route path="/" render={(props)=>
                    <Grid>
                      <Col xs={14} md={20}>
                        <Row xs={10} md={10}>
                          <Carousel>
                            <Carousel.Item>
                              <img width={900} height={500} alt="900x500" src="http://img.wxcha.com/file/201711/28/0ba7b1180e.jpg?down" />
                              <Carousel.Caption>
                                <h3>My Idol</h3>
                              </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                              <img width={900} height={500} alt="900x500" src="http://img.im17.com/upload/cimg/2012/09-26/CV4VR32635714142861850668.jpg" />
                              <Carousel.Caption>
                                <h3>Second slide label</h3>
                                <p>My Idol</p>
                              </Carousel.Caption>
                            </Carousel.Item>
                          </Carousel>
                        </Row>
                      </Col>
                    </Grid>
                  }/>
                </Switch>
              </div>
            </div>
          </Router>
        </div>

    );
  }
}
export default App